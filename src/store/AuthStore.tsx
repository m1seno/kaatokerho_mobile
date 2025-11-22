import React, { useEffect, PropsWithChildren } from "react";
// https://github.com/pmndrs/zustand
import { create } from "zustand";
// https://docs.expo.dev/versions/latest/sdk/securestore/
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api";

// Käyttäjätiedot
export type User = {
  keilaajaId: number;
  etunimi: string;
  sukunimi: string;
  syntymapaiva: string;
  aktiivijasen: boolean;
  admin: boolean;
  kayttajanimi: string;
};

// AuthStore:n tila ja metodit
type AuthState = {
  user: User | null;
  accessToken: string | null;
  isRestoring: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

// Luodaan globaali useState, jota voidaan käyttää missä tahansa komponentissa
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isRestoring: true,

  // Käynnistyksessä: yritetään lukea token SecureStoresta ja hakea käyttäjätiedot
  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const idStr = await SecureStore.getItemAsync("keilaajaId");
      if (!token || !idStr) {
        set({ isRestoring: false, user: null, accessToken: null });
        return;
      }

      const keilaajaId = Number(idStr);

      // Jos token löytyy, api-interceptor lisää sen Authorization-headeriin automaattisesti
      const res = await api.get<User>(`/api/keilaaja/${keilaajaId}`);
      const user: User = res.data;

      set({
        user,
        accessToken: token,
        isRestoring: false,
      });
    } catch (e) {
      console.log("restoreSession error:", e);
      // Jos jotain menee pieleen, aloitetaan puhtaalta pöydältä
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("keilaajaId");
      set({ user: null, accessToken: null, isRestoring: false });
    }
  },

  // Kirjautuminen käyttäjänimellä + salasanalla
  login: async (username, password) => {
    try {
      const res = await api.post<{ token: string; keilaaja: User }>(
        "/api/login",
        { kayttajanimi: username, salasana: password }
      );

      const { token, keilaaja } = res.data;

      await SecureStore.setItemAsync("accessToken", token);
      await SecureStore.setItemAsync("keilaajaId", String(keilaaja.keilaajaId));


      set({
        user: keilaaja,
        accessToken: token,
      });

      return true;
    } catch (e) {
      console.log("login error:", e);
      return false;
    }
  },

  // Kirjaudutaan ulos ja poistetaan tiedot SecureStoresta
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("keilaajaId");
    } catch (e) {
      console.log("logout error:", e);
    } finally {
      set({
        user: null,
        accessToken: null,
      });
    }
  },
}));

// Käsittele globaalisti 401 Unauthorized -virheet (esim. token vanhentunut)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      await logout();
    }
    return Promise.reject(error);
  }
);

// Välitetään App.tsx:lle, jotta voidaan suorittaa restoreSession käynnistyksessä
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const isRestoring = useAuthStore((s) => s.isRestoring);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isRestoring) {
    // Tänne lisätään myöhemmin SplashScreenin tai spinnerin
    return null;
  }

  return <>{children}</>;
};
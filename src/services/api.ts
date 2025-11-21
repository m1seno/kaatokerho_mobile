import axios from "axios";
import * as SecureStore from "expo-secure-store";

// iOS-simulaattori → "http://localhost:8080"
// Android-emulaattori → "http://10.0.2.2:8080"
// Expo Go (puhelin) → "http://192.168.50.101:8080"

const BASE_URL = "http://192.168.50.101:8080"; 

// Luo axios-instanssi perus-URL:llä
export const api = axios.create({
  baseURL: BASE_URL
});

// https://docs.expo.dev/versions/latest/sdk/securestore/#securestoregetitemasynckey-options
// Lisää access token jokaisen pyynnön otsikkoon
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
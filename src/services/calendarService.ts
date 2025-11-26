import { api } from "./api";

export type Calendar = {
  gpId: number;
  jarjestysnumero: number;
  pvm: string; // ISO date string
  keilahalli: string;
  voittaja: string | null;
  voittotulos: number | null;
};

// Palauttaa kuluvan kauden GP-kalenterin
export const getCalendarForCurrentSeason = async (): Promise<Calendar[]> => {
  const res = await api.get<Calendar[]>("/api/kalenteri/current");
  if (!res.data) {
    throw new Error("Kalenteritietoja ei löydy");
  }
  return res.data;
}
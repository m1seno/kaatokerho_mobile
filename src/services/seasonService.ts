import { api } from "./api";

export type Season = {
  kausiId: number;
  nimi: String;
  gpMaara: number;
  suunniteltuGpMaara: number;
  osallistujamaara: number;
};

// Palauttaa nykyisen kauden tiedot
export const getCurrentSeason = async (): Promise<Season> => {
  const res = await api.get<Season>("/api/kausi/current");
    if (!res.data) {
    throw new Error("Kausitietoja ei löydy");
  }
  return res.data;
};
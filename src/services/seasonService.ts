import { api } from "./api";

type Season = {
  kausiId: number;
  nimi: String;
  gpMaara: number;
  suunniteltuGpMaara: number;
  osallistujamaara: number;
};

// Palauttaa nykyisen kauden tiedot
export const getCurrentSeason = async (): Promise<Season> => {
  const res = await api.get<Season>("/api/kausi/current");
  return res.data;
};
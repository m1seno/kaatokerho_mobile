import { api } from "./api";

export type StandingsRow = {
  sija: number;
  keilaajaId: number;
  nimi: string;
  gpMaara: number;
  pisteet: number;
  pisteetPerGp: number;
  gpVoitot: number;
  gpTulokset: (number | null)[];
  yhteensa: number;
  kaGp: number;
  kaSarja: number;
};

// Palauttaa nykyisen sarjataulukon
export const getCurrentStandings = async (): Promise<StandingsRow[]> => {
  const res = await api.get<StandingsRow[]>("/api/sarjataulukko/current");
  if (!res.data) {
    throw new Error("Sarjataulukkotietoja ei löydy");
  }
  return res.data;
};
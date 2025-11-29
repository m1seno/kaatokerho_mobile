import { api } from "./api";

export type Season = {
  kausiId: number;
  nimi: String;
  gpMaara: number;
  suunniteltuGpMaara: number;
  osallistujamaara: number;
};

export type SeasonCreateUpdate = {
  nimi: string;
  suunniteltuGpMaara: number;
  osallistujamaara: number;
}

// Palauttaa nykyisen kauden tiedot
export const getCurrentSeason = async (): Promise<Season> => {
  const res = await api.get<Season>("/api/kausi/current");
    if (!res.data) {
    throw new Error("Kausitietoja ei löydy");
  }
  return res.data;
};

// Hae kaikki kaudet
export const getAllSeasons = async (): Promise<Season[]> => {
  try {
    const res = await api.get<Season[]>("/api/kausi");
    return res.data;
  } catch (error) {
    console.error("Kausia ei löytynyt", error);
    throw error;
  }
};

// Luo uusi kausi
export const createSeason = async (payload: SeasonCreateUpdate): Promise<Season> => {
  try {
    const res = await api.post<Season>("/api/kausi", payload);
    return res.data;
  } catch (error) {
    console.error("Kauden lisääminen epäonnistui:", error);
    throw error;
  }
};

// Päivitä olemassa oleva kausi
export const updateSeason = async (kausiId: number, payload: SeasonCreateUpdate): Promise<Season> => {
  try {
    const res = await api.put<Season>(`/api/kausi/${kausiId}`, payload);
    return res.data;
  } catch (error) {
    console.error("Failed to update season:", error);
    throw error;
  }
};

// Poista kausi
export const deleteSeason = async (kausiId: number): Promise<void> => {
  try {
    await api.delete<void>(`/api/kausi/${kausiId}`);
  } catch (error) {
    console.error("Kauden poistaminen epäonnistui:", error);
    throw error;
  }
};
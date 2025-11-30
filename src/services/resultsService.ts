import { api } from "./api";

//Response-body
export type Results = {
  tulosId: number;
  gpId: number;
  keilaajaId: number;
  keilaajaEtunimi: string;
  keilaajaSukunimi: string;
  sarja1: number;
  sarja2: number;
  osallistui: boolean;
};

export type PostResults = {
  gpId: number;
  vyoUnohtui: boolean;
  tulokset: {
    keilaajaId: number;
    sarja1: number;
    sarja2: number;
  }[];
};

// Gp-kohtaisten tulosten haku
export const getResultsByGpId = async (gpId: number): Promise<Results[]> => {
  try {
    const response = await api.get<Results[]>(`/api/tulokset/gp/${gpId}`);
    return response.data;
  } catch (error) {
    console.error("Tulosten haku epäonnistui", error);
    throw error;
  }
};

// Tulosten lisäys yhdelle GP:lle
export const addResultsForGp = async (
  payload: PostResults
): Promise<Results[]> => {
  try {
    const response = await api.post<Results[]>("/api/tulokset", payload);
    return response.data;
  } catch (error) {
    console.error("Tulosten lisäys epäonnistui", error);
    throw error;
  }
};

// Kaikkien tietyn GP:n tulosten poisto
export const deleteResultsForGp = async (gpId: number): Promise<void> => {
  try {
    await api.delete<void>(`/api/tulokset/gp/${gpId}`);
  } catch (error) {
    console.error("Tulosten poisto epäonnistui", error);
    throw error;
  }
};
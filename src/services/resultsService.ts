import { api } from "./api";

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

export const getResultsByGpId = async (gpId: number): Promise<Results[]> => {
  try {
    const response = await api.get<Results[]>(`/api/tulokset/gp/${gpId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch results", error);
    throw error;
  }
};
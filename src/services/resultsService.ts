import { api } from "./api";

export type Result = {
  tulosId: number;
  gpId: number;
  keilaajaId: number;
  keilaajaEtunimi: string;
  keilaajaSukunimi: string;
  sarja1: number;
  sarja2: number;
  osallistui: boolean;
};

export const getResultsByGpId = async (gpId: number): Promise<Result[]> => {
  try {
    const response = await api.get<Result[]>(`/api/tulokset/gp/${gpId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch results", error);
    throw error;
  }
}
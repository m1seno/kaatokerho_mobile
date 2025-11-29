import { api } from "./api";
import { Keilahalli } from "./keilahalliService";
import { Season } from "./seasonService";

export type NextGp = {
  gpId: number;
  jarjestysnumero: number;
  pvm: string;
  kausiId: number;
  kausiNimi: string;
  keilahalliId: number;
  keilahalliNimi: string;
  onKultainenGp: boolean;
};

export type Gp = {
  gpId: number;
  kausi: Season;
  keilahalli: Keilahalli;
  pvm: string;
  jarjestysnumero: number;
  onKultainenGp: boolean;
};

export type CreateGpPayload = {
  jarjestysnumero: number;
  pvm: string;
  keilahalliId: number;
  kultainenGp: boolean;
  kausiId: number;
};

// Patch-metodi, joten sisältö optionaleja
export type UpdateGpPayload = {
  pvm?: string;
  keilahalliId?: number;
  onKultainenGp?: boolean;
};

// Palauttaa kuluvan kauden seuraavan GP:n, jolle ei ole vielä syötetty yhtään tulosta.
export const getNextGp = async (): Promise<NextGp> => {
  const res = await api.get<NextGp>("/api/gp/next");
  if (!res.data) {
    throw new Error("Seuraavaa GP:tä ei löydy");
  }
  return res.data;
}

export const getGpsBySeason = async (kausiId: number): Promise<Gp[]> => {
  try {
    const res = await api.get<Gp[]>(`/api/gp/kausi/${kausiId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch GPs by season:", error);
    throw error;
  }
};

export const createGp = async (payload: CreateGpPayload): Promise<Gp> => {
  try {
    const res = await api.post<Gp>("/api/gp", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create GP:", error);
    throw error;
  }
};

export const updateGp = async (
  gpId: number,
  payload: UpdateGpPayload
): Promise<Gp> => {
  try {
    const res = await api.patch<Gp>(`/api/gp/${gpId}`, payload);
    return res.data;
  } catch (error) {
    console.error("Failed to update GP:", error);
    throw error;
  }
};

export const deleteGp = async (gpId: number): Promise<void> => {
  try {
    await api.delete<void>(`/api/gp/${gpId}`);
  } catch (error) {
    console.error("Failed to delete GP:", error);
    throw error;
  }
};
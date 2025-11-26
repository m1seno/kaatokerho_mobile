import { api } from "./api";

export type Challenger = {
  keilaajaId: number;
  nimi: string;
  sarja1: number;
  sarja2: number;
};

export type ChallengerList = {
  gpId: number;
  gpNo: number;
  pvm: string;
  haastajat: Challenger[];
};

export type CurrentChampion = {
    id: number;
    gpId: number;
    gpNo: number;
    pvm: string;
    puolustajaId: number;
    puolustajaNimi: string;
    haastajaId: number;
    haastajaNimi: string;
    voittajaId: number;
    voittajaNimi: string;
    vyoUnohtui: boolean;
};

// Palauttaa tämän hetkisen Kuppiksen Kunkku -haastajalistan
export const getCurrentChallengerList = async (): Promise<ChallengerList> => {
  try {
    const res = await api.get<ChallengerList>("/api/kk/haastajalista/latest");
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      throw new Error(err.response.data?.message ?? "Haastajalistaa ei löydy");
    }
    throw err;
  }
};


export const getCurrentChampion = async ( season: string ): Promise<CurrentChampion> => {
  try {
    const res = await api.get<CurrentChampion>("/api/kk/current", { params: { season } });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      throw new Error(err.response.data?.message ?? "Kuppiksen Kunkkua ei löydy");
    }
    throw err;
  }
};
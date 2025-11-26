import { api } from "./api";

type NextGp = {
  gpId: number;
  jarjestysnumero: number;
  pvm: string;
  kausiId: number;
  kausiNimi: string;
  keilahalliId: number;
  keilahalliNimi: string;
  onKultainenGp: boolean;
};

// Palauttaa kuluvan kauden seuraavan GP:n, jolle ei ole vielä syötetty yhtään tulosta.
export const getNextGp = async (): Promise<NextGp> => {
  const res = await api.get<NextGp>("/api/gp/next");
  return res.data;
}
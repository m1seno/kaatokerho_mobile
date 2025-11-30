import { api } from "./api";

export type Keilahalli = {
    keilahalliId: string,
    nimi: string,
    kaupunki: string,
    valtio: string
};

export const getAllKeilahallit = async (): Promise<Keilahalli[]> => {
    try {
        const response = await api.get<Keilahalli[]>("/api/keilahalli");
        return response.data;
    } catch (error) {
        console.error("Keilahallien haku ei onnistunut:", error);
        throw error;
    }
};
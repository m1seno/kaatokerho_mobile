import { api } from "../services/api";

export type Keilaaja = {
    keilaajaId: number;
    etunimi: string;
    sukunimi: string;
    syntymapaiva: string; // ISO date string
    aktiivijasen: boolean;
    admin: boolean;
    kayttajanimi: string;
};

export type KeilaajaCreate = {
    etunimi: string;
    sukunimi: string;
    syntymapaiva: string; // ISO date string
    aktiivijasen: boolean;
    admin: boolean;
    kayttajanimi: string;
    salasana: string;
};

export type KeilaajaUpdate = {
    etunimi: string;
    sukunimi: string;
    syntymapaiva: string; // ISO date string
    aktiivijasen: boolean;
    admin: boolean;
    kayttajanimi: string;
};

export const fetchAllKeilaajat = async (): Promise<Keilaaja[]> => {
    try {
        const response = await api.get<Keilaaja[]>("/api/keilaaja");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch keilaajat:", error);
        throw error;
    }
};

export const fetchKeilaajaById = async (keilaajaId: number): Promise<Keilaaja> => {
    try {
        const response = await api.get<Keilaaja>(`/api/keilaaja/${keilaajaId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch keilaaja:", error);
        throw error;
    }
};

export const createKeilaaja = async (newKeilaaja: KeilaajaCreate): Promise<Keilaaja> => {
    try {
        console.log("createdKeilaaja payload:", JSON.stringify(newKeilaaja, null, 2));
        const response = await api.post<Keilaaja>("/api/keilaaja", newKeilaaja);
        return response.data;
    } catch (error) {
        console.error("Failed to create keilaaja:", error);
        throw error;
    }
};

export const updateKeilaaja = async (keilaajaId: number, updatedKeilaaja: KeilaajaUpdate): Promise<Keilaaja> => {
    try {
        const response = await api.put<Keilaaja>(`/api/keilaaja/${keilaajaId}`, updatedKeilaaja);
        return response.data;
    } catch (error) {
        console.error("Failed to update keilaaja:", error);
        throw error;
    }
};

export const deleteKeilaaja = async (keilaajaId: number): Promise<void> => {
    try {
        const response = await api.delete<void>(`/api/keilaaja/${keilaajaId}`);
    } catch (error) {
        console.error("Failed to delete keilaaja:", error);
        throw error;
    }
};
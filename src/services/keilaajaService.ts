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
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Error fetching keilaajat: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Failed to fetch keilaajat:", error);
        throw error;
    }
};

export const fetchKeilaajaById = async (keilaajaId: number): Promise<Keilaaja> => {
    try {
        const response = await api.get<Keilaaja>(`/api/keilaaja/${keilaajaId}`);
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Error fetching keilaaja: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Failed to fetch keilaaja:", error);
        throw error;
    }
};

export const createKeilaaja = async (newKeilaaja: KeilaajaCreate): Promise<KeilaajaCreate> => {
    try {
        const response = await api.post<KeilaajaCreate>("/api/keilaaja", newKeilaaja);
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Error creating keilaaja: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Failed to create keilaaja:", error);
        throw error;
    }
};

export const updateKeilaaja = async (keilaajaId: number, updatedKeilaaja: KeilaajaUpdate): Promise<KeilaajaUpdate> => {
    try {
        const response = await api.put<KeilaajaUpdate>(`/api/keilaaja/${keilaajaId}`, updatedKeilaaja);
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Error updating keilaaja: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Failed to update keilaaja:", error);
        throw error;
    }
};

export const deleteKeilaaja = async (keilaajaId: number): Promise<void> => {
    try {
        const response = await api.delete<void>(`/api/keilaaja/${keilaajaId}`);
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Error deleting keilaaja: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Failed to delete keilaaja:", error);
        throw error;
    }
};
import axios from "axios";
import type { ApiResponse } from "../types/api";

export interface ClubListResponse {
    id: string;
    name: string;  
    logo: string;
}

export interface ClubPageResponse {
    count: number;
    data: ClubListResponse[];   
}

export interface ClubResponse {
    id: string;
    name: string;
    shortName: string;
    city: string;
    country: string;
    logo: string;
    isOnline: boolean;
    isOurClub: boolean;
}

export interface ClubRequest {
    name: string;
    shortName: string;
    city: string;
    country: string;
    isOurClub: boolean;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/admin/club`;

export interface ClubFilters {
    isOurClub?: boolean;
    name?: string;
}

export const listClubs = async (page: number, limit: number, filters: ClubFilters = {}): Promise<ClubPageResponse> => {
    const token = localStorage.getItem('jwt');
    const response = await axios.get<ApiResponse<ClubPageResponse>>(`${BASE_URL}/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, ...filters },
    });
    return response.data.data;
}

export const getClub = async (id: string): Promise<ClubResponse> => {
    const token = localStorage.getItem('jwt');
    const response = await axios.get<ApiResponse<ClubResponse>>(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
}


export const editClub = async (id: string, data: ClubRequest): Promise<void> => {
    const token = localStorage.getItem('jwt');
    await axios.patch<ApiResponse<null>>(`${BASE_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const uploadClubLogo = async (id: string, file: File): Promise<void> => {
    const token = localStorage.getItem('jwt');
    const formData = new FormData();
    formData.append('file', file);
    await axios.patch<ApiResponse<null>>(`${BASE_URL}/${id}/logo`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const createClubWithLogo = async (data: ClubRequest, file: File): Promise<void> => {
    const token = localStorage.getItem('jwt');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    await axios.post<ApiResponse<null>>(`${BASE_URL}/`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const deleteClub = async (id: string): Promise<void> => {
    const token = localStorage.getItem('jwt');
    await axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const importClubs = async (file: File): Promise<void> => {
    const token = localStorage.getItem('jwt');
    const formData = new FormData();
    formData.append('file', file);
    await axios.post<ApiResponse<null>>(`${BASE_URL}/import`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

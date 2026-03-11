import axios from "axios";
import type { CompetitionType } from "../types/competition";
import type { ApiResponse } from "../types/api";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/admin/competition`;

export interface CompetitionPageResponse {
    count: number;
    data: CompetitionResponse[];
}

export interface CompetitionResponse {
    id: string;
    name: string;
    season: string;
    type: CompetitionType;
}

export interface CompetitionRequest {
    name: string;
    season: string;
    competitionType: CompetitionType;
}

export interface CompetitionFilters {
    name?: string;
    season?: string;
    type?: CompetitionType[];
}

export const listCompetitions = async (page: number, limit: number, filters: CompetitionFilters = {}): Promise<CompetitionPageResponse> => {
    const token = localStorage.getItem('jwt');
    const response = await axios.get<ApiResponse<CompetitionPageResponse>>(`${BASE_URL}/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, ...filters },
    });
    return response.data.data;
}

export const createCompetition = async (data: CompetitionRequest): Promise<void> => {
    const token = localStorage.getItem('jwt');
    await axios.post<ApiResponse<null>>(`${BASE_URL}/`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const editCompetition = async (id: string, data: CompetitionRequest): Promise<void> => {
    const token = localStorage.getItem('jwt');
    await axios.patch<ApiResponse<null>>(`${BASE_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const deleteCompetition = async (id: string): Promise<ApiResponse<null>> => {
    const token = localStorage.getItem('jwt');
    const response =await axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log('deleteCompetition response:', response);
    return response.data;
}
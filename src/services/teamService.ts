import axios from "axios";
import type { ApiResponse } from "../types/api";

export type AgeGroupEnum = 'U6_U7' | 'U8_U9' | 'U10_U11' | 'U12_U13' | 'U14_U15' | 'U16_U17' | 'U18_U19' | 'SENIOR';
export type GenderEnum = 'MEN' | 'WOMEN';

export interface TeamListResponse {
    id: string;
    name: string;
    ageGroup: AgeGroupEnum;
    gender: GenderEnum;
    coachName?: string;
    photo?: string;
}

export interface TeamFilters {
    gender?: GenderEnum;
    ageGroup?: AgeGroupEnum;
}

export interface TeamPageResponse {
    count: number;
    data: TeamListResponse[];
}

export interface TeamResponse {
    id: string;
    name: string;
    ageGroup: AgeGroupEnum;
    gender: GenderEnum;
    coachName: string;
    coverImage: string;
}

export interface TeamRequest {
    name: string;
    ageGroup: AgeGroupEnum;
    gender: GenderEnum;
    coachName?: string;
}

const baseUrl = (clubId: string) => `${import.meta.env.VITE_API_BASE_URL}/api/admin/club/${clubId}/team`;

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('jwt')}` });

export const listTeams = async (
    clubId: string,
    page = 1,
    limit = 10,
    filters: TeamFilters = {},
): Promise<TeamPageResponse> => {
    const response = await axios.get<TeamPageResponse>(`${baseUrl(clubId)}/list`, {
        headers: authHeader(),
        params: { page, limit, ...filters },
    });
    return response.data;
};

export const getTeam = async (clubId: string, teamId: string): Promise<TeamResponse> => {
    const response = await axios.get<ApiResponse<TeamResponse>>(`${baseUrl(clubId)}/${teamId}`, {
        headers: authHeader(),
    });
    return response.data.data;
};

export const createTeam = async (clubId: string, data: TeamRequest, file: File | null): Promise<void> => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    await axios.post<ApiResponse<null>>(`${baseUrl(clubId)}/`, formData, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
    });
};

export const editTeam = async (clubId: string, teamId: string, data: TeamRequest): Promise<void> => {
    await axios.patch<ApiResponse<null>>(`${baseUrl(clubId)}/${teamId}`, data, {
        headers: authHeader(),
    });
};

export const uploadTeamCover = async (clubId: string, teamId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await axios.patch<ApiResponse<null>>(`${baseUrl(clubId)}/${teamId}/cover/upload`, formData, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteTeam = async (clubId: string, teamId: string): Promise<void> => {
    await axios.delete<ApiResponse<null>>(`${baseUrl(clubId)}/${teamId}`, {
        headers: authHeader(),
    });
};

export const importTeams = async (clubId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await axios.post<ApiResponse<null>>(`${baseUrl(clubId)}/import`, formData, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
    });
};

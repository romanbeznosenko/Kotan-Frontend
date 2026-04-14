import axios from 'axios';
import type { ApiResponse } from '../types/api';

export type PositionEnum = 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'STRIKER';
export type GenderEnum   = 'MEN' | 'WOMEN';

export interface PlayerListResponse {
    id: string;
    firstName: string;
    lastName: string;
    jerseyNumber: string;
    position: PositionEnum;
    photo: string | null;
}

export interface PlayerPageResponse {
    count: number;
    data: PlayerListResponse[];
}

export interface PlayerFilters {
    teamId?: string;
    position?: PositionEnum;
    gender?: GenderEnum;
}

export interface PlayerRequest {
    firstName: string;
    lastName: string;
    position: PositionEnum;
    gender: GenderEnum;
    jerseyNumber: string;
    /** ISO date string: YYYY-MM-DD */
    birthDate: string;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/admin/player`;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('jwt')}` });

export const listPlayers = async (
    page = 1,
    limit = 10,
    filters: PlayerFilters = {},
): Promise<PlayerPageResponse> => {
    // Only include filter params that have a real value (no empty strings / undefined)
    const params: Record<string, unknown> = { page, limit };
    if (filters.teamId)   params.teamId   = filters.teamId;
    if (filters.position) params.position = filters.position;
    if (filters.gender)   params.gender   = filters.gender;

    const response = await axios.get<PlayerPageResponse>(`${BASE_URL}/list`, {
        headers: authHeader(),
        params,
    });
    return response.data;
};

export const editPlayer = async (
    playerId: string,
    teamId: string,
    data: PlayerRequest,
    file?: File | null,
): Promise<string> => {
    const formData = new FormData();
    // teamId is @RequestPart on the backend — must be sent as application/json
    formData.append('teamId', new Blob([JSON.stringify(teamId)], { type: 'application/json' }));
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    const response = await axios.put<ApiResponse<string>>(
        `${BASE_URL}/${playerId}`,
        formData,
        { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } },
    );
    return response.data.data;
};

export const createPlayer = async (
    teamId: string,
    data: PlayerRequest,
    file?: File | null,
): Promise<string> => {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    const response = await axios.post<ApiResponse<string>>(
        `${BASE_URL}/`,
        formData,
        { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }, params: { teamId } },
    );
    return response.data.data;
};

import axios from 'axios';
import type { ApiResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginRequest {
    email: string;
    password: string;
    staySignedIn?: boolean;
}

export interface LoginResponse {
    jwt: string;
    refreshToken: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<ApiResponse<LoginResponse>>(`${BASE_URL}/auth/login`, data);
    return response.data.data;
};

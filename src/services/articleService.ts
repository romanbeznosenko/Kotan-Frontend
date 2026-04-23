import axios from 'axios';
import type { ApiResponse } from '../types/api';

export type ArticleCategoryEnum = 'SENIOR' | 'JUNIOR' | 'MLODZIK' | 'ORLIK' | 'ZAK' | 'GIRLS';
export type ArticleBodyTypeEnum = 'PARAGRAPH' | 'QUOTE' | 'HEADING';

export interface ArticleBodyRequest {
    type: ArticleBodyTypeEnum;
    text: string;
}

export interface ArticleRequest {
    title: string;
    shortPreview: string;
    category: ArticleCategoryEnum;
    body: ArticleBodyRequest[];
}

export interface ArticleListItem {
    articleId: string;
    title: string;
    shortPreview: string;
    category: ArticleCategoryEnum;
    date: string; // ISO Instant
    image: string | null;
}

export interface ArticlePageResponse {
    data: ArticleListItem[];
    count: number;
}

export interface ArticleBodyResponse {
    articleBodyId: string;
    type: ArticleBodyTypeEnum;
    text: string;
    orderIndex: number;
}

export interface ArticleResponse {
    articleId: string;
    title: string;
    shortPreview: string;
    image: string | null;
    heroImage: string | null;
    date: string;
    body: ArticleBodyResponse[];
}

export interface ArticleFilters {
    category?: ArticleCategoryEnum;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/admin/article`;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('jwt')}` });

export const getArticle = async (articleId: string): Promise<ArticleResponse> => {
    const response = await axios.get<ApiResponse<ArticleResponse>>(`${BASE_URL}/${articleId}`, {
        headers: authHeader(),
    });
    return response.data.data;
};

export const listArticles = async (
    page = 1,
    limit = 10,
    filters: ArticleFilters = {},
): Promise<ArticlePageResponse> => {
    const params: Record<string, unknown> = { page, limit };
    if (filters.category) params.category = filters.category;

    const response = await axios.get<ArticlePageResponse>(`${BASE_URL}/list`, {
        headers: authHeader(),
        params,
    });
    return response.data;
};

export const editArticle = async (
    articleId: string,
    data: ArticleRequest,
    image?: File | null,
    heroImage?: File | null,
): Promise<string> => {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (image)     formData.append('image',     image);
    if (heroImage) formData.append('heroImage', heroImage);

    const response = await axios.put<ApiResponse<string>>(
        `${BASE_URL}/${articleId}`,
        formData,
        { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } },
    );
    return response.data.data;
};

export const deleteArticle = async (articleId: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${articleId}`, { headers: authHeader() });
};

export const createArticle = async (
    data: ArticleRequest,
    image?: File | null,
    heroImage?: File | null,
): Promise<string> => {
    const formData = new FormData();
    // Note: backend has a typo — "requesst" with double s
    formData.append('requesst', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (image)     formData.append('image',     image);
    if (heroImage) formData.append('heroImage', heroImage);

    const response = await axios.post<ApiResponse<string>>(
        `${BASE_URL}/`,
        formData,
        { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } },
    );
    return response.data.data;
};

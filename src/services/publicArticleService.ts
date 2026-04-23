import axios from 'axios';
import type { ArticleCategoryEnum, ArticleBodyTypeEnum } from './articleService';

export interface PublicArticleListItem {
    articleId: string;
    title: string;
    shortPreview: string;
    category: ArticleCategoryEnum;
    date: string; // ISO Instant
    image: string | null;
}

export interface PublicArticlePageResponse {
    data: PublicArticleListItem[];
    count: number;
}

export interface PublicArticleBodyItem {
    type: ArticleBodyTypeEnum;
    text: string;
    orderIndex: number;
}

export interface PublicArticleDetail {
    articleId: string;
    title: string;
    shortPreview: string;
    category: ArticleCategoryEnum;
    date: string; // ISO Instant
    image: string | null;
    heroImage: string | null;
    body: PublicArticleBodyItem[];
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/public/article`;

export const listPublicArticles = async (
    page = 1,
    limit = 10,
    category?: ArticleCategoryEnum,
): Promise<PublicArticlePageResponse> => {
    const params: Record<string, unknown> = { page, limit };
    if (category) params.category = category;

    const response = await axios.get<PublicArticlePageResponse>(`${BASE_URL}/list`, { params });
    return response.data;
};

export const getPublicArticle = async (articleId: string): Promise<PublicArticleDetail> => {
    const response = await axios.get<{ data: PublicArticleDetail }>(`${BASE_URL}/${articleId}`);
    return response.data.data;
};

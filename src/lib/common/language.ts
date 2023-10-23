import type { PublicationInfo } from '$lib/common/@types/common';

export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;

export type ArticleLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const getEnglishArticles = (articles: PublicationInfo[]): PublicationInfo[] =>
	articles.filter(article => article.lang === 'en');

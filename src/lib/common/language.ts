import type { LinkInfo } from '$lib/common/@types/common';

export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;

export type ArticleLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const getEnglishArticles = (articles: LinkInfo[]): LinkInfo[] =>
	articles.filter(article => article.lang === 'en');

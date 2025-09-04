import type { PublicationInfo } from '$lib/types';

export const getEnglishArticles = (articles: PublicationInfo[]): PublicationInfo[] =>
	articles.filter(article => article.lang === 'en');

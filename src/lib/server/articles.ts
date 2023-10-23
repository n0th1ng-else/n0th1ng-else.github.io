import { fetchArticles } from '$lib/server/selectors';
import type { PublicationInfo } from '$lib/common/@types/common';

export const getArticleInfo = (slug: string, showDraft: boolean): PublicationInfo | null => {
	const articles = fetchArticles();
	const result = articles.find(article => article.id === slug);

	if (!result) {
		return null;
	}

	if (!showDraft && result.draft) {
		return null;
	}

	return result;
};

export const getAllArticles = (showDraft = false): PublicationInfo[] => {
	const articles = fetchArticles();
	if (!showDraft) {
		return articles.filter(article => !article.draft);
	}
	return articles;
};

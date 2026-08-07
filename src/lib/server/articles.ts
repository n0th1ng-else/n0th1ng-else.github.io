import { fetchArticles } from '$lib/server/selectors';
import type { PublicationInfo } from '$lib/types';

// Public reads never expose drafts. Drafts are managed under /admin and shared
// only via the unlisted /draft/<share_token> preview (see routes/draft/[token]).

export const getArticleInfo = (slug: string): PublicationInfo | null => {
	const result = fetchArticles().find(article => article.id === slug);

	if (!result || result.draft) {
		return null;
	}

	return result;
};

export const getAllArticles = (): PublicationInfo[] =>
	fetchArticles().filter(article => !article.draft);

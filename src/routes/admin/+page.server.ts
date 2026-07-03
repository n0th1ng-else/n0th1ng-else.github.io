import { getArticleRows, getCounts, getLinkRows, revalidate } from '$lib/server/content';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const links = getLinkRows().map(link => ({
		id: link.id,
		kind: link.kind,
		title: link.title,
		url: link.url
	}));
	const articles = getArticleRows().map(article => ({
		id: article.id,
		slug: article.slug,
		title: article.title,
		status: article.status,
		source: article.source,
		// Unlisted preview URL; only drafts carry a token (cleared on publish).
		shareToken: article.share_token
	}));
	return {
		counts: getCounts(),
		links,
		drafts: articles.filter(article => article.status === 'draft'),
		published: articles.filter(article => article.status === 'published')
	};
};

export const actions: Actions = {
	// Re-pull the in-memory cache from the DB (after adding/editing content).
	revalidate: async () => {
		await revalidate();
		return { revalidated: true };
	}
};

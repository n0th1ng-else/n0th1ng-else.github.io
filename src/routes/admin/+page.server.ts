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
		source: article.source
	}));
	return { counts: getCounts(), links, articles };
};

export const actions: Actions = {
	// Re-pull the in-memory cache from the DB (after adding/editing content).
	revalidate: async () => {
		await revalidate();
		return { revalidated: true };
	}
};

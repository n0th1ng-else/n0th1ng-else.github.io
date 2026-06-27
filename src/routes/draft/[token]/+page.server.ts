import { error } from '@sveltejs/kit';
import { getArticleRowByShareToken } from '$lib/server/content';
import { parseMarkdown } from '$lib/server/markdown';
import type { PageServerLoad } from './$types';

// Unlisted preview of a draft, readable without login via an unguessable share token.
// Once the article is published (reconciled from markdown), its token is cleared -> 404.
export const load: PageServerLoad = async ({ params }) => {
	const article = getArticleRowByShareToken(params.token);
	if (!article || article.status !== 'draft') {
		error(404, 'Not found');
	}
	return {
		title: article.title,
		description: article.description,
		content: await parseMarkdown(article.body_md)
	};
};

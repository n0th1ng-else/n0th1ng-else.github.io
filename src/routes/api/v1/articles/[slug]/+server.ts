import { error, json } from '@sveltejs/kit';
import { getArticleInfo } from '$lib/server/articles';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, params }) => {
	const logger = new Logger('api:article');
	const showDraft = url.searchParams.get('draft') === 'true';
	const slug = params.slug;

	try {
		const article = getArticleInfo(slug, showDraft);
		if (article) {
			return json(article);
		}
	} catch (err) {
		logger.error('Failed to read article', err);
		throw error(500, 'Something went wrong');
	}

	throw error(404, 'Article not found');
};

import { error, json } from '@sveltejs/kit';
import { getArticleInfo } from '$lib/server/articles';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	const logger = new Logger('api:article');
	const slug = params.slug;

	try {
		const article = getArticleInfo(slug);
		if (article) {
			return json(article);
		}
	} catch (err) {
		logger.error('Failed to read article', err);
		error(500, 'Something went wrong');
	}

	error(404, 'Article not found');
};

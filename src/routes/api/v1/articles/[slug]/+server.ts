import { error, json } from '@sveltejs/kit';
import { fetchExternalArticles } from '$lib/server/selectors';
import { getInternalArticle } from '$lib/server/articles';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, params }) => {
	const logger = new Logger('api:article');
	const showDraft = url.searchParams.get('draft') === 'true';
	const slug = params.slug;

	try {
		const internal = getInternalArticle(slug, showDraft);
		if (internal) {
			return json(internal);
		}
	} catch (err) {
		logger.error('Failed to read internal articles', err);
		throw error(500, 'Something went wrong');
	}

	try {
		const externalArticles = fetchExternalArticles();
		const external = externalArticles.find(({ id }) => id === slug);
		if (external) {
			return json(external);
		}
	} catch (err) {
		logger.error('Failed to read external articles', err);
		throw error(500, 'Something went wrong');
	}

	throw error(404, 'Article not found');
};

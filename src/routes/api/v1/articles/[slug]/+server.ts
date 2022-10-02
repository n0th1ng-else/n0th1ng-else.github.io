import { error } from '@sveltejs/kit';
import { fetchExternalArticles } from '$lib/server/selectors';
import { getInternalArticle } from '$lib/server/articles';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, params }) => {
	try {
		const showDraft = url.searchParams.get('draft') === 'true';
		const slug = params.slug;

		const internal = getInternalArticle(slug, showDraft);
		if (internal) {
			return new Response(JSON.stringify(internal));
		}

		const externalArticles = fetchExternalArticles();
		const external = externalArticles.find(({ id }) => id === slug);
		if (external) {
			return new Response(JSON.stringify(external));
		}

		throw error(404, 'Article not found');
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

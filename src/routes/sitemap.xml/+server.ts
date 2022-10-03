import { getAllArticles } from '$lib/server/articles';
import { sortByDate } from '$lib/common/date';
import { getXMLHeaders } from '$lib/server/xml';
import { generateSitemap } from '$lib/server/sitemap';
import { getRoutes } from '$lib/common/routes';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url: urlData }) => {
	const url = urlData.origin;

	const articles = sortByDate(getAllArticles());
	const ids = articles.map(({ id }) => id);
	const routes = getRoutes(url, ids);

	return new Response(generateSitemap(url, routes), {
		headers: getXMLHeaders()
	});
};

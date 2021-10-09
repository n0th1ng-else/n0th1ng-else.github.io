import type { RequestHandler } from '@sveltejs/kit';
import { getArticles } from '../helpers/selectors';
import { sortByDate } from '../helpers/date';
import { generateRss } from '../helpers/rss';

export const get: RequestHandler<void, void, string> = ({ host }) => {
	const articles = sortByDate(getArticles());
	return {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=600',
			'Content-Type': 'application/xml'
		},
		body: generateRss(host, articles)
	};
};

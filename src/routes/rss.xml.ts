import type { RequestHandler } from '@sveltejs/kit';
import { getArticles, getSelfUrl } from '../helpers/selectors';
import { sortByDate } from '../helpers/date';
import { generateRss } from '../helpers/rss';
import { getUrlPrefix } from '../helpers/api';

export const get: RequestHandler<void, void, string> = () => {
	const articles = sortByDate(getArticles());
	const url = getUrlPrefix(getSelfUrl());
	return {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=600',
			'Content-Type': 'application/xml'
		},
		body: generateRss(url, articles)
	};
};

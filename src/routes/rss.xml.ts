import type { RequestHandler } from '@sveltejs/kit';
import { getSelfUrl } from '../helpers/selectors';
import { sortByDate } from '../helpers/date';
import { generateRss } from '../helpers/rss';
import { getUrlPrefix } from '../helpers/api';
import { getAllArticles } from '../helpers/server/articles';

export const get: RequestHandler<void, void, string> = () => {
	const articles = sortByDate(getAllArticles());
	const url = getUrlPrefix(getSelfUrl());
	return {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=600',
			'Content-Type': 'application/xml'
		},
		body: generateRss(url, articles)
	};
};

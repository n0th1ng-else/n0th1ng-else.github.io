import { getArticles } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import type { LinkInfo } from '$lib/common/@types/common';
import type { PageServerLoad } from './$types';

interface Output {
	articles: LinkInfo[];
	url: string;
}
export const load: PageServerLoad<Output> = async ({ url }) => {
	try {
		const articles = await getArticles(url.origin);

		return {
			articles: articles.items,
			url: url.toString()
		};
	} catch (err) {
		const logger = new Logger('home:ssr');
		logger.error('Failed to load home', err);

		return {
			articles: [],
			url: url.toString()
		};
	}
};

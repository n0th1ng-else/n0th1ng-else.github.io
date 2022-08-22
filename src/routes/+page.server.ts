import { getArticles } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import type { LinkInfo } from '$lib/common/@types/common';
import type { PageServerLoad } from './$types';

interface Output {
	articles: LinkInfo[];
	url: string;
}
export const load: PageServerLoad<Output> = async ({ url: urlData }) => {
	const url = urlData.origin;
	try {
		const articles = await getArticles(url);

		return {
			articles: articles.items,
			url: urlData.toString()
		};
	} catch (err) {
		const logger = new Logger('home:ssr');
		logger.error('Failed to load home', err);

		return {
			articles: [],
			url: urlData.toString()
		};
	}
};

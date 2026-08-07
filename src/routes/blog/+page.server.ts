import { getArticles } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import type { PublicationInfo } from '$lib/types';
import type { PageServerLoad } from './$types';

interface Output {
	articles: PublicationInfo[];
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
		const logger = new Logger('articles:ssr');
		logger.error('Failed to load articles', err);

		return {
			articles: [],
			url: url.toString()
		};
	}
};

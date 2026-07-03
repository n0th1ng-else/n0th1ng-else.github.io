import { getArticles } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { sortArticlesByDate } from '$lib/common/date';
import { getEnglishArticles } from '$lib/common/language';
import type { PublicationInfo } from '$lib/types';
import type { PageServerLoad } from './$types';

interface Output {
	url: string;
	host: string;
	article?: PublicationInfo;
}
export const load: PageServerLoad<Output> = async ({ url }) => {
	try {
		const articles = await getArticles(url.origin);
		const engArticles = getEnglishArticles(articles.items);
		const sortedArticles = sortArticlesByDate(engArticles);
		const article = sortedArticles.at(0);

		return {
			article,
			url: url.toString(),
			host: url.origin
		};
	} catch (err) {
		const logger = new Logger('home:ssr');
		logger.error('Failed to load home', err);

		return {
			url: url.toString(),
			host: url.origin
		};
	}
};

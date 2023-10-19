import { getArticles } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { shouldShowDraft } from '$lib/server/url';
import { sortByDate } from '$lib/common/date';
import { getEnglishArticles } from '$lib/common/language';
import type { LinkInfo } from '$lib/common/@types/common';
import type { PageServerLoad } from './$types';

interface Output {
	showDraft: boolean;
	url: string;
	article?: LinkInfo;
}
export const load: PageServerLoad<Output> = async ({ url }) => {
	const showDraft = shouldShowDraft(url);
	try {
		const articles = await getArticles(url.origin, showDraft);
		const engArticles = getEnglishArticles(articles.items);
		const sortedArticles = sortByDate(engArticles);
		const article = sortedArticles.at(0);

		return {
			showDraft,
			article,
			url: url.toString()
		};
	} catch (err) {
		const logger = new Logger('home:ssr');
		logger.error('Failed to load home', err);

		return {
			showDraft,
			url: url.toString()
		};
	}
};

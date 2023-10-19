import { getArticles } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { shouldShowDraft } from '$lib/server/url';
import type { LinkInfo } from '$lib/common/@types/common';
import type { PageServerLoad } from './$types';

interface Output {
	showDraft: boolean;
	articles: LinkInfo[];
	url: string;
}
export const load: PageServerLoad<Output> = async ({ url }) => {
	const showDraft = shouldShowDraft(url);
	try {
		const articles = await getArticles(url.origin, showDraft);

		return {
			showDraft,
			articles: articles.items,
			url: url.toString()
		};
	} catch (err) {
		const logger = new Logger('articles:ssr');
		logger.error('Failed to load articles', err);

		return {
			showDraft,
			articles: [],
			url: url.toString()
		};
	}
};

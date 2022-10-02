import { getArticle } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import type { LinkInfo } from '$lib/common/@types/common';
import type { PageServerLoad } from './$types';

interface Output {
	article?: LinkInfo;
	url: string;
}
export const load: PageServerLoad<Output> = async ({ url: urlData, params }) => {
	const url = urlData.origin;
	try {
		const article = await getArticle(url, params.slug);
		return {
			article,
			url: urlData.toString()
		};
	} catch (err) {
		const logger = new Logger('article:ssr');
		logger.error('Failed to load article', err);
		return {
			url: urlData.toString()
		};
	}
};

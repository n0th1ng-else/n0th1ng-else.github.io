import { redirect } from '@sveltejs/kit';
import { getArticle } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { notFoundRoute } from '$lib/common/routes';
import type { PublicationInfo } from '$lib/types';
import type { PageServerLoad } from './$types';

interface Output {
	article: PublicationInfo;
	url: string;
	host: string;
}
export const load: PageServerLoad<Output> = async ({ url, params }) => {
	try {
		const article = await getArticle(url.origin, params.slug);
		return {
			article,
			url: url.toString(),
			host: url.origin
		};
	} catch (err) {
		const logger = new Logger('article:ssr');
		logger.error('Failed to load article', err);
		redirect(307, notFoundRoute);
	}
};

import { redirect } from '@sveltejs/kit';
import { getArticle } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { notFoundRoute } from '$lib/common/routes';
import { shouldShowDraft } from '$lib/server/url';
import type { PublicationInfo } from '$lib/common/@types/common';
import type { PageServerLoad } from './$types';

interface Output {
	article: PublicationInfo;
	url: string;
	host: string;
}
export const load: PageServerLoad<Output> = async ({ url, params }) => {
	try {
		const showDraft = shouldShowDraft(url);
		const article = await getArticle(url.origin, params.slug, showDraft);
		return {
			article,
			url: url.toString(),
			host: url.origin
		};
	} catch (err) {
		const logger = new Logger('article:ssr');
		logger.error('Failed to load article', err);
		throw redirect(307, notFoundRoute);
	}
};

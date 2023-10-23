import { error, json } from '@sveltejs/kit';
import { DEFAULT_PAGE_SIZE } from '$lib/server/const';
import { getAllArticles } from '$lib/server/articles';
import { Logger } from '$lib/common/log';
import type { WithPagination } from '$lib/common/types';
import type { PublicationInfo } from '$lib/common/@types/common';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const logger = new Logger('api:articles');
	const showDraft = url.searchParams.get('draft') === 'true';

	try {
		const items = getAllArticles(showDraft);

		const body: WithPagination<PublicationInfo> = {
			page: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			items,
			total: items.length
		};

		return json(body);
	} catch (err) {
		logger.error('Unable to read articles', err);
		throw error(500, 'Something went wrong');
	}
};

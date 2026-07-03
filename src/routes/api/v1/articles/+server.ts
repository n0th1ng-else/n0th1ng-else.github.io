import { error, json } from '@sveltejs/kit';
import { DEFAULT_PAGE_SIZE } from '$lib/server/const';
import { getAllArticles } from '$lib/server/articles';
import { Logger } from '$lib/common/log';
import type { WithPagination } from '$lib/common/types';
import type { PublicationInfo } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const logger = new Logger('api:articles');

	try {
		const items = getAllArticles();

		const body: WithPagination<PublicationInfo> = {
			page: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			items,
			total: items.length
		};

		return json(body);
	} catch (err) {
		logger.error('Unable to read articles', err);
		error(500, 'Something went wrong');
	}
};

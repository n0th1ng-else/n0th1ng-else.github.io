import { error } from '@sveltejs/kit';
import { DEFAULT_PAGE_SIZE } from '$lib/server/const';
import { getAllArticles } from '$lib/server/articles';
import type { WithPagination } from '$lib/common/types';
import type { LinkInfo } from '$lib/common/@types/common';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	try {
		const showDraft = url.searchParams.get('draft') === 'true';
		const items = getAllArticles(showDraft);

		const body: WithPagination<LinkInfo> = {
			page: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			items,
			total: items.length
		};

		return new Response(JSON.stringify(body));
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

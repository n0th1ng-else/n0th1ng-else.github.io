import type { RequestHandler } from '@sveltejs/kit';

import type { LinkInfo } from '../../../../../common';
import { getArticles } from '../../../../helpers/selectors';
import { getInternalArticles } from '../../../../helpers/server/articles';

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, void, LinkInfo[]> = ({ query }) => {
	try {
		const showDraft = query.get('draft') === 'true';
		const items = [...getArticles(), ...getInternalArticles(showDraft)];

		const body = {
			page: 1,
			pageSize: 100,
			items,
			total: items.length
		};
		return {
			body
		};
	} catch (e) {
		return {
			status: 500,
			body: {
				message: 'Something went wrong'
			}
		};
	}
};

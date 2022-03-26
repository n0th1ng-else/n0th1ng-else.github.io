import type { RequestHandler } from '@sveltejs/kit';

import { getInternalArticle } from '../../../../helpers/server/articles';
import { getExternalArticles } from '../../../../helpers/selectors';
import type { LinkInfo } from '../../../../../common';
import { getPreview } from '../../../../helpers/server/images';

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, void, LinkInfo> = ({ params, query }) => {
	try {
		const showDraft = query.get('draft') === 'true';
		const slug = params.slug;

		const internal = getInternalArticle(slug, showDraft);
		if (internal) {
			return {
				body: internal
			};
		}

		const externalArticles = getExternalArticles();
		const external = externalArticles.find(({ id }) => id === slug);
		if (external) {
			return {
				body: {
					...external,
					meta: {
						...external.meta,
						imagePreview: getPreview(external.meta.image)
					}
				}
			};
		}

		return {
			status: 404,
			body: {
				message: 'Not found'
			}
		};
	} catch (e) {
		return {
			status: 404,
			body: {
				message: 'Not found'
			}
		};
	}
};

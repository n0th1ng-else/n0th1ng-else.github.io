import type { RequestHandler } from '@sveltejs/kit';
import type { MetaInfo } from '../../../../common';
import { getProfile } from '../../../helpers/selectors';

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, void, MetaInfo> = () => {
	return {
		body: getProfile()
	};
};

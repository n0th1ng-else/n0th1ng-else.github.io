import type { RequestHandler } from '@sveltejs/kit';
import type { LinkInfo } from '../../../../common';
import { getPackages } from '../../../helpers/selectors';

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, void, LinkInfo[]> = () => {
	return {
		body: getPackages()
	};
};

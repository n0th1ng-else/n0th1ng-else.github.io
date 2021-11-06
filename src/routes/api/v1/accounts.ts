import type { RequestHandler } from '@sveltejs/kit';
import type { ProfileAccounts } from '../../../../common';
import { getAccounts } from '../../../helpers/selectors';

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, void, ProfileAccounts> = () => {
	return {
		body: getAccounts()
	};
};

import { error, json } from '@sveltejs/kit';
import { fetchAccounts } from '$lib/server/selectors';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const logger = new Logger('api:accounts');
	try {
		const profile = fetchAccounts();
		return json(profile);
	} catch (err) {
		logger.error('Unable to read accounts', err);
		throw error(500, 'Something went wrong');
	}
};

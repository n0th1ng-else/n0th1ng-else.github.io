import { error } from '@sveltejs/kit';
import { fetchAccounts } from '$lib/server/selectors';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	try {
		const profile = fetchAccounts();
		return new Response(JSON.stringify(profile));
	} catch (err) {
		const logger = new Logger('api:accounts');
		logger.error('Unable to read accounts', err);
		throw error(500, 'Something went wrong');
	}
};

import { error, json } from '@sveltejs/kit';
import { readProfile } from '$lib/server/selectors';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const logger = new Logger('api:profile');
	try {
		const profile = readProfile();
		return json(profile);
	} catch (err) {
		logger.error('Unable to read profile', err);
		throw error(500, 'Something went wrong');
	}
};

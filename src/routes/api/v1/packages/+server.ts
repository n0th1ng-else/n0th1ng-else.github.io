import { error, json } from '@sveltejs/kit';
import { fetchPackages } from '$lib/server/selectors';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const logger = new Logger('api:packages');
	try {
		const packages = fetchPackages();
		return json(packages);
	} catch (err) {
		logger.error('Unable to read packages', err);
		error(500, 'Something went wrong');
	}
};

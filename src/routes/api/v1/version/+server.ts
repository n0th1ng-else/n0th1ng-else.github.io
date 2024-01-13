import { error, json } from '@sveltejs/kit';
import { readEnvironment } from '$lib/server/selectors';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const logger = new Logger('api:version');
	try {
		const { version, versionBuild } = readEnvironment();
		return json({ version, versionBuild });
	} catch (err) {
		logger.error('Unable to read version', err);
		error(500, 'Something went wrong');
	}
};

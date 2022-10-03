import { error, json } from '@sveltejs/kit';
import { ApplicationStatus } from '$lib/common/api/types';
import { getVersion } from '$lib/common/version';
import { readEnvironment } from '$lib/server/selectors';
import { getUpTime } from '$lib/server/uptime';
import { Logger } from '$lib/common/log';
import type { MetaEnvironment } from '$lib/server/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const logger = new Logger('api:health');
	const fullVersion = true;

	let environment: MetaEnvironment | null = null;
	try {
		environment = readEnvironment();
	} catch (err) {
		logger.error('Unable to read healthcheck', err);
		throw error(500, 'Something went wrong');
	}
	const { version, versionBuild } = environment;

	return json({
		status: ApplicationStatus.OK,
		uptime: getUpTime(),
		version: getVersion(
			{
				version,
				versionBuild
			},
			fullVersion
		)
	});
};

import { json } from '@sveltejs/kit';
import { ApplicationStatus } from '$lib/common/api/types';
import { getVersion } from '$lib/common/version';
import { Logger } from '$lib/common/log';
import { readEnvironment } from '$lib/server/selectors';
import { getCounts, isLoaded } from '$lib/server/content';
import { warmup } from '$lib/server/warmup';
import { getUpTime } from '$lib/server/uptime';
import type { RequestHandler } from './$types';

const logger = new Logger('api:health');

export const GET: RequestHandler = () => {
	const fullVersion = true;
	const { version, versionBuild } = readEnvironment();
	const counts = getCounts();

	// "loaded" => the app booted and warmed its cache with real data.
	// Non-zero counts is the readiness signal used by the Dockerfile HEALTHCHECK.
	const loaded = counts.articles + counts.packages + counts.links > 0;

	// Boot failed (or the DB was empty): retry the warmup in the background so the
	// periodic healthcheck probes double as recovery attempts.
	if (!isLoaded()) {
		warmup().catch((err: unknown) => {
			logger.error('Warmup retry failed', err);
		});
	}

	return json(
		{
			status: loaded ? ApplicationStatus.OK : ApplicationStatus.ERROR,
			loaded,
			counts,
			uptime: getUpTime(),
			version: getVersion({ version, versionBuild }, fullVersion)
		},
		{ status: loaded ? 200 : 503 }
	);
};

import { json } from '@sveltejs/kit';
import { ApplicationStatus } from '$lib/common/api/types';
import { getVersion } from '$lib/common/version';
import { readEnvironment } from '$lib/server/selectors';
import { getCounts } from '$lib/server/content';
import { getUpTime } from '$lib/server/uptime';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const fullVersion = true;
	const { version, versionBuild } = readEnvironment();
	const counts = getCounts();

	// "loaded" => the app booted and warmed its cache with real data.
	// Non-zero counts is the readiness signal used by the Dockerfile HEALTHCHECK.
	const loaded = counts.articles + counts.packages + counts.links > 0;

	return json(
		{
			status: ApplicationStatus.OK,
			loaded,
			counts,
			uptime: getUpTime(),
			version: getVersion({ version, versionBuild }, fullVersion)
		},
		{ status: loaded ? 200 : 503 }
	);
};

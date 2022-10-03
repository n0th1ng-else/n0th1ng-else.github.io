import { error } from '@sveltejs/kit';
import { ApplicationStatus } from '$lib/common/api/types';
import { getVersion } from '$lib/common/version';
import { readEnvironment } from '$lib/server/selectors';
import { getUpTime } from '$lib/server/uptime';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const fullVersion = true;
		const { version, versionBuild } = readEnvironment();
		return new Response(
			JSON.stringify({
				status: ApplicationStatus.OK,
				uptime: getUpTime(),
				version: getVersion(
					{
						version,
						versionBuild
					},
					fullVersion
				)
			})
		);
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

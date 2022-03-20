import type { RequestHandler } from '@sveltejs/kit';
import { getVersion } from '../helpers/version';
import { getUpTime } from '../helpers/uptime';
import { ApplicationStatus, StatusDto } from '../types/api';

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, void, StatusDto> = () => {
	const fullVersion = true;
	return {
		body: {
			status: ApplicationStatus.OK,
			version: getVersion(fullVersion),
			uptime: getUpTime()
		}
	};
};

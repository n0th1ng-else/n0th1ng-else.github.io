import type { RequestHandler } from '@sveltejs/kit';
import { getVersion } from '../helpers/version';

enum Status {
	OK = 'OK'
}

export const get: RequestHandler<void, void, { status: Status; version: string }> = () => {
	const fullVersion = true;
	return {
		body: {
			status: Status.OK,
			version: getVersion(fullVersion)
		}
	};
};

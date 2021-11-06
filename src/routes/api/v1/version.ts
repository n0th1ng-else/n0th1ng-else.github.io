import type { RequestHandler } from '@sveltejs/kit';
import { getVersion, getVersionBuild } from '../../../helpers/selectors';
import type { Version } from '../../../types/api';

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, void, Version> = () => {
	return {
		body: {
			version: getVersion(),
			build: getVersionBuild()
		}
	};
};

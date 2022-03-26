import type { Handle } from '@sveltejs/kit';
import { initUptime } from './helpers/uptime';
import { getSelfUrl, isProduction } from './helpers/selectors';
import { getUrlPrefix } from './helpers/api';
import { initCache } from './helpers/server/images';

export const handle: Handle<void, void> = ({ request, resolve }) => {
	if (isProduction()) {
		const url = getUrlPrefix(getSelfUrl());
		initUptime(url);
		initCache();
	}

	return resolve(request);
};

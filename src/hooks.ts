import type { Handle } from '@sveltejs/kit';
import { initUptime } from './helpers/uptime';
import { getSelfUrl, isProduction } from './helpers/selectors';
import { getUrlPrefix } from './helpers/api';

export const handle: Handle<void, void> = ({ request, resolve }) => {
	if (isProduction()) {
		const url = getUrlPrefix(getSelfUrl());
		initUptime(url);
	}

	return resolve(request);
};

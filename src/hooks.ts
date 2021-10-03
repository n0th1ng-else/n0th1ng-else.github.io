import type { Handle } from '@sveltejs/kit';
import { initUptime } from './helpers/uptime';
import { isProduction } from './helpers/selectors';

export const handle: Handle<void, void> = ({ request, resolve }) => {
	if (isProduction()) {
		initUptime(request.host);
	}

	return resolve(request);
};

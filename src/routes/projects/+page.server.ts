import { getPackages } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import type { LinkInfo } from '$lib/common/@types/common';
import type { PageServerLoad } from './$types';

interface Output {
	packages?: LinkInfo[];
	url: string;
}
export const load: PageServerLoad<Output> = async ({ url }) => {
	try {
		const packages = await getPackages(url.origin);
		return {
			packages,
			url: url.toString()
		};
	} catch (err) {
		const logger = new Logger('projects:ssr');
		logger.error('Failed to load projects', err);
		return {
			packages: [],
			url: url.toString()
		};
	}
};

import { getAccounts, getProfile, getVersion } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import type { MetaInfo, ProfileAccounts } from '$lib/common/@types/common';
import type { Version } from '$lib/common/api/types';
import type { PageServerLoad } from './$types';

interface Output {
	accounts?: ProfileAccounts;
	profile?: MetaInfo;
	version?: Version;
}
export const load: PageServerLoad<Output> = async ({ url: urlData }) => {
	const url = urlData.origin;
	try {
		const accounts = await getAccounts(url);
		const profile = await getProfile(url);
		const version = await getVersion(url);
		return {
			accounts,
			profile,
			version
		};
	} catch (err) {
		const logger = new Logger('layout:ssr');
		logger.error('Failed to load layout', err);
		return {};
	}
};

import { getAccounts, getProfile, getVersion } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { readTheme } from '$lib/common/theme';
import type { MetaInfo, ProfileAccounts } from '$lib/common/@types/common';
import type { Version } from '$lib/common/api/types';
import type { Theme } from '$lib/common/theme';
import type { PageServerLoad } from './$types';

interface Output {
	accounts?: ProfileAccounts;
	profile?: MetaInfo;
	version?: Version;
	theme: Theme;
}
export const load: PageServerLoad<Output> = async ({ url: urlData, cookies }) => {
	const theme = readTheme(cookies);
	const url = urlData.origin;
	try {
		const accounts = await getAccounts(url);
		const profile = await getProfile(url);
		const version = await getVersion(url);
		return {
			accounts,
			profile,
			version,
			theme
		};
	} catch (err) {
		const logger = new Logger('layout:ssr');
		logger.error('Failed to load layout', err);
		return {
			theme
		};
	}
};

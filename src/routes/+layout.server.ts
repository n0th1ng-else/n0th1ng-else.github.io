import { getAccounts, getProfile, getVersion } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { readTheme } from '$lib/common/theme';
import type { MetaInfo, ProfileAccounts } from '$lib/common/@types/common';
import type { Version } from '$lib/common/api/types';
import type { Theme } from '$lib/common/theme';
import type { LayoutServerLoad } from './$types';

interface Output {
	accounts?: ProfileAccounts;
	profile?: MetaInfo;
	version?: Version;
	theme: Theme;
}
export const load: LayoutServerLoad<Output> = async ({ url, cookies }) => {
	const theme = readTheme(cookies);
	const urlOrigin = url.origin;
	try {
		const accounts = await getAccounts(urlOrigin);
		const profile = await getProfile(urlOrigin);
		const version = await getVersion(urlOrigin);
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

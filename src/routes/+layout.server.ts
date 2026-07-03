import { getAccounts, getProfile, getVersion } from '$lib/common/api';
import { Logger } from '$lib/common/log';
import { readTheme } from '$lib/common/theme';
import { getReadingList } from '$lib/server/content';
import type { Version } from '$lib/common/api/types';
import type { Theme } from '$lib/common/theme';
import type { ProfileAccounts, ProfileInfo } from '$lib/types';
import type { LayoutServerLoad } from './$types';

interface Output {
	accounts?: ProfileAccounts;
	profile?: ProfileInfo;
	version?: Version;
	theme: Theme;
	hasReadingList: boolean;
}
export const load: LayoutServerLoad<Output> = async ({ url, cookies }) => {
	const theme = readTheme(cookies);
	const urlOrigin = url.origin;
	// Sync read from the in-memory content cache; drives the "Reading" nav item.
	const hasReadingList = getReadingList().length > 0;
	try {
		const accounts = await getAccounts(urlOrigin);
		const profile = await getProfile(urlOrigin);
		const version = await getVersion(urlOrigin);
		return {
			accounts,
			profile,
			version,
			theme,
			hasReadingList
		};
	} catch (err) {
		const logger = new Logger('layout:ssr');
		logger.error('Failed to load layout', err);
		return {
			theme,
			hasReadingList
		};
	}
};

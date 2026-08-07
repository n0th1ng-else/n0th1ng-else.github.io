import { getPackages, getPublications } from '$lib/server/content';
import { getRuntimeEnvironment } from '$lib/server/env';
import { getMetaEnvironment } from '$lib/server/runtime-env';
import type {
	MetaEnvironment,
	PackageInfo,
	ProfileAccounts,
	ProfileInfo,
	PublicationInfo
} from '$lib/types';

// All reads are served from the in-memory content cache (see content.ts), warmed at boot.
// The env block is derived from process.env (see runtime-env.ts).

export const readProfile = (): ProfileInfo => {
	const { GH_AUTHOR_LOGIN } = getRuntimeEnvironment();
	// GitHub serves the avatar at this stable URL (redirects to avatars.githubusercontent.com).
	return { image: `https://github.com/${GH_AUTHOR_LOGIN}.png?size=460` };
};

export const fetchPackages = (): PackageInfo[] => getPackages();

export const fetchArticles = (): PublicationInfo[] => getPublications();

export const readEnvironment = (): MetaEnvironment => getMetaEnvironment();

export const isProduction = (): boolean => readEnvironment().mode === 'production';

export const fetchAccounts = (): ProfileAccounts => readEnvironment().accounts;

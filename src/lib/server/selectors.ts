import { readJsonFile, rootDir } from '$lib/server/file';
import type { MetaEnvironment, MetaFile } from '$lib/server/types';
import type {
	PublicationInfo,
	ProfileAccounts,
	PackageInfo,
	ProfileInfo
} from '$lib/common/@types/common';

const metaCache: MetaFile | null = null;

const readMetaFile = (): MetaFile => {
	if (metaCache) {
		return metaCache;
	}
	const profile = `${rootDir}meta/index.json`;
	return readJsonFile<MetaFile>(profile);
};

export const readProfile = (): ProfileInfo => readMetaFile().profile;

export const fetchPackages = (): PackageInfo[] => readMetaFile().packages;

export const fetchArticles = (): PublicationInfo[] => readMetaFile().publications;

export const readEnvironment = (): MetaEnvironment => readMetaFile().env;

export const isProduction = (): boolean => readEnvironment().mode === 'production';

export const fetchAccounts = (): ProfileAccounts => readEnvironment().accounts;

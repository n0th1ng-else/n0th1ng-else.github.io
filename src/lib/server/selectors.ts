import { readJsonFile, rootDir } from '$lib/server/file';
import type {
	MetaEnvironment,
	MetaFile,
	PackageInfo,
	ProfileAccounts,
	ProfileInfo,
	PublicationInfo
} from '$lib/types';

let metaCache: MetaFile | null = null;

const readMetaFile = (): MetaFile => {
	if (!metaCache) {
		const profile = `${rootDir}meta/index.json`;
		metaCache = readJsonFile<MetaFile>(profile);
	}

	return metaCache;
};

export const readProfile = (): ProfileInfo => readMetaFile().profile;

export const fetchPackages = (): PackageInfo[] => readMetaFile().packages;

export const fetchArticles = (): PublicationInfo[] => readMetaFile().publications;

export const readEnvironment = (): MetaEnvironment => readMetaFile().env;

export const isProduction = (): boolean => readEnvironment().mode === 'production';

export const fetchAccounts = (): ProfileAccounts => readEnvironment().accounts;

import { readJsonFile, rootDir } from '$lib/server/file';
import type { MetaEnvironment, MetaFile } from '$lib/server/types';
import type { MetaInfo, LinkInfo, ProfileAccounts } from '$lib/common/@types/common';

const metaCache: MetaFile | null = null;

const readMetaFile = (): MetaFile => {
	if (metaCache) {
		return metaCache;
	}
	const profile = `${rootDir}meta/index.json`;
	return readJsonFile<MetaFile>(profile);
};

export const readProfile = (): MetaInfo => readMetaFile().profile;

export const fetchPackages = (): LinkInfo[] => readMetaFile().packages;

export const fetchExternalArticles = async (): Promise<LinkInfo[]> =>
	Promise.resolve(readMetaFile().publications);

export const readEnvironment = (): MetaEnvironment => readMetaFile().env;

export const isProduction = (): boolean => readEnvironment().mode === 'production';

export const getSelfUrl = (): string => readEnvironment().selfUrl;

export const fetchAccounts = (): ProfileAccounts => readEnvironment().accounts;

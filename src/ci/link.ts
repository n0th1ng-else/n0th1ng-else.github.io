import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { getEnv } from './env.ts';
import { getPathUrl, metaFileName, metaFolderName } from './dirs.ts';
import type { MetaFile, ProfileAccounts } from '../lib/types.ts';

export type Accounts = keyof ProfileAccounts;

export type PackageFile = {
	link?: string;
	logo?: string;
} & PublicationFile;

export type PublicationFile = {
	service: Accounts;
	url: string;
	lang: 'en' | 'ru';
};

export type ResourceFile = {
	services: Record<Accounts, { host: string; pattern: string }>;
	packages: PackageFile[];
	publications: PublicationFile[];
};

export const saveMetaToFile = (rootDir: URL, meta: MetaFile): URL => {
	if (!existsSync(getPathUrl(rootDir, metaFolderName))) {
		mkdirSync(getPathUrl(rootDir, metaFolderName));
	}

	const filePath = getPathUrl(rootDir, metaFolderName, metaFileName);
	const content = JSON.stringify(meta, null, 2);
	writeFileSync(filePath, `${content}\n`);
	return filePath;
};

const getLoginByService = (service: Accounts): string => {
	const env = getEnv();
	const login = env.accounts[service];
	if (!login) {
		throw new Error(`Login for ${service} not found`);
	}
	return login;
};

export const getFullLink = (
	data: ResourceFile,
	service: Accounts,
	path = '',
	lang = ''
): string => {
	const host = data.services[service].host;
	const pattern = data.services[service].pattern;
	const login = getLoginByService(service);
	if (!pattern) {
		throw new Error(`Service must have pattern (compiling ${service})`);
	}
	const url = pattern
		.replace('%h', host)
		.replace('%u', login)
		.replace('%p', path)
		.replace('%l', lang);
	return `https://${url}`;
};

export const sleepFor = (ms = 1_000) => new Promise(resolve => setTimeout(resolve, ms));

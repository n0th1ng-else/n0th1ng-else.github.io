import type { LinkInfo, MetaInfo, ProfileAccounts } from '$lib/common/@types/common';

export interface MetaEnvironment {
	accounts: ProfileAccounts;
	distInRoot: boolean;
	mode: string;
	version: string;
	versionBuild: string;
	selfUrl: string;
}

export interface MetaFile {
	profile: MetaInfo;
	env: MetaEnvironment;
	packages: LinkInfo[];
	publications: LinkInfo[];
}

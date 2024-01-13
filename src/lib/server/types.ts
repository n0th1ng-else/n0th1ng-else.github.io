import type {
	ProfileInfo,
	PackageInfo,
	ProfileAccounts,
	PublicationInfo
} from '$lib/common/@types/common';

export interface MetaEnvironment {
	accounts: ProfileAccounts;
	mode: string;
	version: string;
	versionBuild: string;
}

export interface MetaFile {
	profile: ProfileInfo;
	env: MetaEnvironment;
	packages: PackageInfo[];
	publications: PublicationInfo[];
}

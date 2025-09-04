import type { Version } from '$lib/common/api/types';

let versionStore = $state<Version>();

export const getVersion = (): Version | undefined => {
	return versionStore;
};

export const setVersion = (version?: Version): void => {
	versionStore = version;
};

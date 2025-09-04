import type { ProfileInfo } from '$lib/types';

let profileStore = $state<ProfileInfo>();

export const getProfile = (): ProfileInfo | undefined => {
	return profileStore;
};

export const setProfile = (profile?: ProfileInfo): void => {
	profileStore = profile;
};

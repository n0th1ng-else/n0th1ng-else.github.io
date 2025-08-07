import type { ProfileAccounts } from '$lib/types';

let accountsStore = $state<ProfileAccounts>();

export const getAccounts = (): ProfileAccounts | undefined => {
	return accountsStore;
};

export const setAccounts = (account?: ProfileAccounts): void => {
	accountsStore = account;
};

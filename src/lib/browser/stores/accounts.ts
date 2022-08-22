import { writable } from 'svelte/store';
import type { ProfileAccounts } from '$lib/common/@types/common';

export const accountsStore = writable<ProfileAccounts | null>();

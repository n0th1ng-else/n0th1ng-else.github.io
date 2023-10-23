import { writable } from 'svelte/store';
import type { ProfileInfo } from '$lib/common/@types/common';

export const profileStore = writable<ProfileInfo | null>();

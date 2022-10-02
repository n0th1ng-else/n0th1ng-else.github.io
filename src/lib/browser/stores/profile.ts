import { writable } from 'svelte/store';
import type { MetaInfo } from '$lib/common/@types/common';

export const profileStore = writable<MetaInfo | null>();

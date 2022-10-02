import { writable } from 'svelte/store';
import type { Version } from '$lib/common/api/types';

export const versionStore = writable<Version | null>();

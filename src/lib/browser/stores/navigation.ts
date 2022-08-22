import { writable } from 'svelte/store';
import type { EmptyToVoid } from '../../../types';

export const showBackStore = writable(false);

export const showBack: EmptyToVoid = () => showBackStore.update(() => true);

export const hideBack: EmptyToVoid = () => showBackStore.update(() => false);

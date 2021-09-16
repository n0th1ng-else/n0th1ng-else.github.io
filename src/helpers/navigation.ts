import { writable } from 'svelte/store';
import type { EmptyToVoid } from '../types';

type ShowBackFn = (show: boolean) => void;

const showBackStore = writable(false);

export const showBack: EmptyToVoid = () => showBackStore.set(true);

export const hideBack: EmptyToVoid = () => showBackStore.set(false);

export const onShowBackChange = (fn: ShowBackFn): EmptyToVoid => showBackStore.subscribe(fn);

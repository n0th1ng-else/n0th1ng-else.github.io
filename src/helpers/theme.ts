import { writable } from 'svelte/store';
import type { EmptyToVoid } from '../types';

export enum Theme {
	Dark = 'dark',
	Light = 'light'
}

type ThemeFn = (theme: Theme) => void;

const store = writable(Theme.Dark);

export const isDarkTheme = (theme: Theme): boolean => theme === Theme.Dark;

export const toggleTheme: ThemeFn = theme =>
	store.set(theme === Theme.Dark ? Theme.Light : Theme.Dark);

export const onThemeChange = (fn: ThemeFn): EmptyToVoid => store.subscribe(fn);

export const defaultTheme = Theme.Dark;

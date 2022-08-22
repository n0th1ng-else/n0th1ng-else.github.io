import { writable } from 'svelte/store';
import { persistData, restoreData, StorageAppKey } from '$lib/browser/utils/storage';
import type { EmptyToVoid } from '../../../types';

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

export const recoverTheme = (): void => {
	const theme = <Theme>restoreData(StorageAppKey.Theme);
	if (!theme) {
		return;
	}
	store.set(theme);
};

export const persistTheme = (theme: Theme): void => persistData(StorageAppKey.Theme, theme);

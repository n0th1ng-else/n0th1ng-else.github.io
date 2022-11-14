import { writable } from 'svelte/store';
import type { EmptyToVoid } from '../../../types';
import type { Theme } from '$lib/common/theme';

type ThemeFn = (theme: Theme) => void;

export const themeStore = writable<Theme>('dark');

export const isDarkTheme = (theme: Theme): boolean => theme === 'dark';

export const toggleTheme: ThemeFn = theme => themeStore.set(theme === 'dark' ? 'light' : 'dark');

export const onThemeChange = (fn: ThemeFn): EmptyToVoid => themeStore.subscribe(fn);

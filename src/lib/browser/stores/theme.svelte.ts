import type { Theme } from '$lib/common/theme';

let themeStore = $state<Theme>('dark');

export const isDarkTheme = (): boolean => themeStore === 'dark';

export const getTheme = (): Theme => {
	return themeStore;
};

export const toggleTheme = (): void => {
	themeStore = themeStore === 'dark' ? 'light' : 'dark';
};

export const setTheme = (theme: Theme): void => {
	themeStore = theme;
};

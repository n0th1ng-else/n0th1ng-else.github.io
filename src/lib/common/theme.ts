import * as t from 'io-ts';
import Cookies from 'js-cookie';
import { function as f, either as e } from 'fp-ts';
import type { CookiesWrapper } from '$lib/common/cookie';
import { getCookie, setCookie } from '$lib/common/cookie';

const Theme = t.union([t.literal('light'), t.literal('dark')]);

export type Theme = t.TypeOf<typeof Theme>;

export const DEFAULT_THEME: Theme = 'dark';

export const readTheme = (instance: CookiesWrapper = Cookies): Theme => {
	return f.pipe(
		getCookie('theme', instance),
		Theme.decode,
		e.fold<unknown, Theme, Theme>(
			() => DEFAULT_THEME,
			cookieTheme => cookieTheme
		)
	);
};

export const persistTheme = (theme: Theme): void => {
	setCookie('theme', theme);
};

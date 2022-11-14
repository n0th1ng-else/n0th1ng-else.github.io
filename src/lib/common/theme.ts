import * as t from 'io-ts';
import Cookies from 'js-cookie';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import type { CookiesWrapper } from '$lib/common/cookie';
import { getCookie, setCookie } from '$lib/common/cookie';

const Theme = t.union([t.literal('light'), t.literal('dark')]);

export type Theme = t.TypeOf<typeof Theme>;

export const DEFAULT_THEME: Theme = 'dark';

export const readTheme = (instance: CookiesWrapper = Cookies): Theme => {
	return pipe(
		getCookie('theme', instance),
		Theme.decode,
		fold<unknown, Theme, Theme>(
			() => DEFAULT_THEME,
			cookieTheme => cookieTheme
		)
	);
};

export const persistTheme = (theme: Theme): void => {
	setCookie('theme', theme);
};

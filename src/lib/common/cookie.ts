import type { Cookies } from '@sveltejs/kit';

type CookieSetter = { set: (name: string, value: string, opts: { path: string }) => void };

const COOKIE_PREFIX = 'nothing-else-blog';

const getId = (id: string) => `${COOKIE_PREFIX}--${id}`;

export const getCookie = (id: string, instance: Pick<Cookies, 'get'>): string => {
	const value = instance.get(getId(id));
	return value || '';
};

export const setCookie = (id: string, value: string, instance: CookieSetter): void => {
	instance.set(getId(id), value, { path: '/' });
};

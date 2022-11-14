import Cookies from 'js-cookie';

const COOKIE_PREFIX = 'nothing-else-blog';

export interface CookiesWrapper {
	get: (id: string) => string | undefined;
	set: (id: string, value: string) => void;
}

export const getCookie = (id: string, instance: CookiesWrapper = Cookies): string => {
	const value = instance.get(`${COOKIE_PREFIX}--${id}`);
	return value || '';
};

export const setCookie = (id: string, value: string, instance: CookiesWrapper = Cookies): void => {
	instance.set(`${COOKIE_PREFIX}--${id}`, value);
};

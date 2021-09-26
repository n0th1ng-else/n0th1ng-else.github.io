import { getVersion as getV } from './selectors';

export const getVersion = (): string => {
	const version = getV().slice(0, 8);
	const prefix = 'v2.0.0';
	return `${prefix}-${version || 'development'}`;
};

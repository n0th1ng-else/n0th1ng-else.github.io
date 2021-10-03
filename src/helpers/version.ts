import { getVersion as getV } from './selectors';

export const getVersion = (fullVersion = false): string => {
	const version = fullVersion ? getV() : getV().slice(0, 8);
	const prefix = '2.0.0';
	return `${prefix}-${version || 'development'}`;
};

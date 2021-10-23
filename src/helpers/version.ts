import { getVersionBuild as getVB, getVersion as getV } from './selectors';

export const getVersion = (fullVersion = false): string => {
	const version = fullVersion ? getVB() : getVB().slice(0, 8);
	const prefix = getV() || '0.0.0';
	return `${prefix}-${version || 'development'}`;
};

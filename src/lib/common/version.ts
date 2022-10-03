import type { Version } from './api/types';

export const getVersion = (version?: Version, fullVersion = false): string => {
	const build = version?.versionBuild || '';
	const ver = fullVersion ? build : build.slice(0, 8);
	const prefix = version?.version || '0.0.0';
	return `v${prefix}-${ver || 'development'}`;
};

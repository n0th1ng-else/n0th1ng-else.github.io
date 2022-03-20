import { readFileSync } from 'fs';

const getResources = () => JSON.parse(readFileSync(new URL('./resources.json', import.meta.url)));

const distInRoot = Boolean(process.env.DIST_ROOT) || false;

const mode = process.env.NODE_ENV || 'development';

const selfUrl = process.env.SELF_URL || 'localhost:3000';

const versionBuild = process.env.COMMIT_HASH || process.env.VERCEL_GIT_COMMIT_SHA || '';

const version = process.env.APP_VERSION || '';

const github = process.env.GH_AUTHOR_LOGIN || '';

const linkedIn = process.env.GH_AUTHOR_LINKED_IN || '';

const telergam = process.env.GH_AUTHOR_TELEGRAM || '';

const medium = process.env.GH_AUTHOR_MEDIUM || '';

const habr = process.env.GH_AUTHOR_HABR || '';

const npm = process.env.GH_AUTHOR_NPM || '';

const twitter = process.env.GH_AUTHOR_TWITTER || '';

const devto = process.env.GH_AUTHOR_DEVTO || '';

const procEnv = {
	accounts: {
		devto,
		github,
		habr,
		linkedIn,
		medium,
		npm,
		telergam,
		twitter
	},
	distInRoot,
	mode,
	version,
	versionBuild,
	selfUrl
};

export const env = {
	procEnv,
	resources: getResources()
};

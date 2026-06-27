import type { MetaEnvironment } from '$lib/types';

// Builds the environment block (accounts, mode, version, build) from process.env at runtime,
// replacing the values that used to be baked into meta/index.json at build time.
// version/build come from runtime env vars (APP_VERSION / COMMIT_HASH) set on the container.
export const getMetaEnvironment = (env = process.env): MetaEnvironment => ({
	accounts: {
		devto: env.GH_AUTHOR_DEVTO ?? '',
		github: env.GH_AUTHOR_LOGIN ?? '',
		habr: env.GH_AUTHOR_HABR ?? '',
		linkedIn: env.GH_AUTHOR_LINKED_IN ?? '',
		medium: env.GH_AUTHOR_MEDIUM ?? '',
		npm: env.GH_AUTHOR_NPM ?? '',
		telegram: env.GH_AUTHOR_TELEGRAM ?? '',
		twitter: env.GH_AUTHOR_TWITTER ?? ''
	},
	mode: env.NODE_ENV ?? 'development',
	version: env.APP_VERSION ?? '',
	versionBuild: env.COMMIT_HASH ?? env.VERCEL_GIT_COMMIT_SHA ?? ''
});

import { z } from 'zod';
import { env as runtimeEnv } from '$env/dynamic/private';

const RuntimeEnvSchema = z
	.object({
		// NODE_ENV: z.string().optional(),
		// COMMIT_HASH: z.string().optional(),
		// APP_VERSION: z.string().optional(),
		GH_AUTHOR_LOGIN: z.string(),
		// GH_AUTHOR_LINKED_IN: z.string(),
		// GH_AUTHOR_TELEGRAM: z.string(),
		// GH_AUTHOR_MEDIUM: z.string(),
		// GH_AUTHOR_HABR: z.string(),
		// GH_AUTHOR_NPM: z.string(),
		// GH_AUTHOR_TWITTER: z.string(),
		// GH_AUTHOR_DEVTO: z.string(),
		CLOUDINARY_ACCOUNT: z.string(),
		CLOUDINARY_KEY: z.string(),
		CLOUDINARY_SECRET: z.string(),
		GITHUB_SECRET: z.string(),
		GITHUB_CLIENT_ID: z.string(),
		DATABASE_HOST: z.string(),
		DATABASE_USER: z.string(),
		DATABASE_PASSWORD: z.string(),
		DATABASE_NAME: z.string(),
		DATABASE_PORT: z.coerce.number(),
		// Optional: only required to publish articles as PRs from the admin editor.
		GITHUB_REPO_TOKEN: z.string().optional(),
		GITHUB_REPO_OWNER: z.string().optional(),
		GITHUB_REPO_NAME: z.string().optional()
	})
	.describe('App env schema');

// Reads from SvelteKit's dynamic private env, which includes .env values in dev and
// process.env in production — plain process.env is NOT populated from .env during `pnpm dev`.
export const getRuntimeEnvironment = (env = runtimeEnv): z.infer<typeof RuntimeEnvSchema> => {
	const parsed = RuntimeEnvSchema.parse(env);
	return parsed;
};

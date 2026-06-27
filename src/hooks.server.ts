import { type Handle, redirect, type ServerInit } from '@sveltejs/kit';
import { ensureSchema } from '$lib/server/db';
import { reconcileArticles } from '$lib/server/articles-sync';
import { getCounts, load } from '$lib/server/content';
import { SESSION_COOKIE, verifySessionToken } from '$lib/server/session';
import { Logger } from '$lib/common/log';

const logger = new Logger('hooks:init');

// Resolves the admin session on every request and guards the /admin area (owner-only).
// The login route is exempt so the owner can start the GitHub OAuth flow.
export const handle: Handle = ({ event, resolve }) => {
	event.locals.admin = verifySessionToken(event.cookies.get(SESSION_COOKIE));

	const { pathname } = event.url;
	if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !event.locals.admin) {
		redirect(303, '/admin/login');
	}

	return resolve(event);
};

// Runs once when the server boots, before handling any request:
// 1) ensure the content schema exists,
// 2) reconcile published articles from the canonical ./articles markdown (git wins),
// 3) warm the in-memory content cache.
export const init: ServerInit = async () => {
	try {
		await ensureSchema();
		await reconcileArticles();
		await load();
		logger.warn('Content cache warmed', getCounts());
	} catch (err) {
		logger.error('Failed to warm content cache at boot', err);
	}
};

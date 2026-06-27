import { redirect } from '@sveltejs/kit';
import { getAuthRedirectUrl } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// Kicks off the owner login: GitHub OAuth -> /api/v1/oauth (verifies GH_AUTHOR_LOGIN) -> /admin.
export const GET: RequestHandler = ({ url, locals }) => {
	if (locals.admin) {
		redirect(303, '/admin');
	}
	const state = encodeURIComponent(JSON.stringify({ action: 'ADMIN_LOGIN' }));
	redirect(302, getAuthRedirectUrl(url.origin, state).toString());
};

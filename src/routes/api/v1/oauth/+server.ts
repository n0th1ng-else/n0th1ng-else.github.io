import { error, json, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { Logger } from '$lib/common/log';
import { ReadingListItemStateSchema } from '$lib/common/readingList';
import { AdminLoginStateSchema } from '$lib/common/admin';
import { getRuntimeEnvironment } from '$lib/server/env';
import { isProduction } from '$lib/server/selectors';
import { saveReadingList } from '$lib/server/readingList';
import { fetchAccessToken, fetchUserName } from '$lib/server/auth';
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '$lib/server/session';
import type { RequestHandler } from './$types';

const SupportedFollowersSchema = z.union([ReadingListItemStateSchema, AdminLoginStateSchema]);

export const GET: RequestHandler = async ({ url: urlData, cookies }) => {
	const logger = new Logger('api:oauth');
	const env = getRuntimeEnvironment();
	const code = urlData.searchParams.get('code');
	const state = urlData.searchParams.get('state');

	let userName = '';
	try {
		const accessToken = await fetchAccessToken(urlData.origin, code ?? '');
		userName = await fetchUserName(accessToken);
	} catch (err) {
		logger.error('Could not fetch access token or user data', err);
		error(401, 'Not authorized');
	}

	if (!userName || userName !== env.GH_AUTHOR_LOGIN) {
		logger.warn('Not authorized', {
			expectedUserName: env.GH_AUTHOR_LOGIN,
			receivedUserName: userName
		});
		error(401, 'Not authorized');
	}

	let data: z.infer<typeof SupportedFollowersSchema>;
	try {
		const parsedState = decodeURIComponent(state ?? '');
		data = SupportedFollowersSchema.parse(JSON.parse(parsedState));
	} catch (err) {
		logger.error('Could not parse the redirect state after auth', err);
		error(400, 'Could not parse the redirect state');
	}

	// Owner verified above — start an admin session and land on the dashboard.
	if (data.action === 'ADMIN_LOGIN') {
		cookies.set(SESSION_COOKIE, createSessionToken(env.GH_AUTHOR_LOGIN), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: isProduction(),
			maxAge: SESSION_MAX_AGE
		});
		redirect(303, '/admin');
	}

	const res = await saveReadingList(data.url, data.note);
	return json({ message: 'Success', res });
};

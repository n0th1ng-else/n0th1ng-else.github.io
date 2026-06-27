import { createHmac, timingSafeEqual } from 'node:crypto';
import { getRuntimeEnvironment } from '$lib/server/env';

// Minimal signed-cookie session for the owner-only admin area. The GitHub OAuth flow
// (/api/v1/oauth) already verifies the user is GH_AUTHOR_LOGIN; on success we issue this
// HMAC-signed cookie so the owner stays authenticated across admin pages.

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

const sign = (payload: string, secret: string): string =>
	createHmac('sha256', secret).update(payload).digest('base64url');

export const createSessionToken = (login: string): string => {
	const { GITHUB_SECRET } = getRuntimeEnvironment();
	const expires = Date.now() + SESSION_MAX_AGE * 1000;
	const encoded = Buffer.from(`${login}:${expires}`).toString('base64url');
	return `${encoded}.${sign(encoded, GITHUB_SECRET)}`;
};

// Returns the owner login if the token is valid and unexpired, otherwise null. Never throws.
export const verifySessionToken = (token: string | undefined): string | null => {
	if (!token) {
		return null;
	}
	try {
		const [encoded, signature] = token.split('.');
		if (!encoded || !signature) {
			return null;
		}
		const { GITHUB_SECRET } = getRuntimeEnvironment();
		const expected = sign(encoded, GITHUB_SECRET);
		const provided = Buffer.from(signature);
		const valid = Buffer.from(expected);
		if (provided.length !== valid.length || !timingSafeEqual(provided, valid)) {
			return null;
		}
		const [login, expires] = Buffer.from(encoded, 'base64url').toString('utf-8').split(':');
		if (!login || !expires || Date.now() > Number(expires)) {
			return null;
		}
		return login;
	} catch {
		return null;
	}
};

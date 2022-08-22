import { error } from '@sveltejs/kit';
import { readEnvironment } from '$lib/server/selectors';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	try {
		const { version, versionBuild } = readEnvironment();
		return new Response(JSON.stringify({ version, versionBuild }));
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

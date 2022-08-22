import { error } from '@sveltejs/kit';
import { readProfile } from '$lib/server/selectors';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	try {
		const profile = readProfile();
		return new Response(JSON.stringify(profile));
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

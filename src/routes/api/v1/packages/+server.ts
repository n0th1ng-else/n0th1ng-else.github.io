import { error } from '@sveltejs/kit';
import { fetchPackages } from '$lib/server/selectors';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	try {
		const packages = fetchPackages();
		return new Response(JSON.stringify(packages));
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

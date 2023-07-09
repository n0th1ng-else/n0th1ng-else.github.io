import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<void> = async () => {
	throw error(404, 'Not found');
};

import { error } from '@sveltejs/kit';
import { initMarkdown, renderMarkdown } from '$lib/server/markdown';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const md = await request.text();
		initMarkdown();
		const result = md ? renderMarkdown(md) : '';

		return new Response(JSON.stringify({ result }));
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

import { error, json } from '@sveltejs/kit';
import { initMarkdown, renderMarkdown } from '$lib/server/markdown';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const logger = new Logger('api:markdown');
	initMarkdown();
	try {
		const md = await request.text();
		const result = md ? renderMarkdown(md) : '';

		return json({ result });
	} catch (err) {
		logger.error('Unable to render markdown', err);
		throw error(500, 'Something went wrong');
	}
};

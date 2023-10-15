import { error, json } from '@sveltejs/kit';
import { renderMarkdown } from '$lib/server/markdown';
import { Logger } from '$lib/common/log';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const logger = new Logger('api:markdown');
	try {
		const md = await request.text();
		const result = md ? await renderMarkdown(md) : '';

		return json({ result });
	} catch (err) {
		logger.error('Unable to render markdown', err);
		throw error(500, 'Something went wrong');
	}
};

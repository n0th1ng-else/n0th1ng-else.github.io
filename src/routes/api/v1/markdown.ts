import type { RequestHandler } from '@sveltejs/kit';
import { initMarkdown, renderMarkdown } from '../../../helpers/markdown';

export const post: RequestHandler<void, { data: string }, { result: string }> = ({ body }) => {
	const md = body.data;
	initMarkdown();
	const result = md ? renderMarkdown(md) : '';

	return {
		body: {
			result
		}
	};
};

import { fail, redirect } from '@sveltejs/kit';
import { revalidate } from '$lib/server/content';
import { createDraft, parseArticleForm } from '$lib/server/articles-repo';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const input = parseArticleForm(await request.formData());
		if (!input.slug || !input.title) {
			return fail(400, { message: 'Slug and title are required' });
		}
		const { id } = await createDraft(input);
		await revalidate();
		redirect(303, `/admin/articles/${id}`);
	}
};

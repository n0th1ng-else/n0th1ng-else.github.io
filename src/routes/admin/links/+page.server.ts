import { fail } from '@sveltejs/kit';
import { getLinkRows, revalidate } from '$lib/server/content';
import { createLink, deleteLink, parseLinkForm } from '$lib/server/links-repo';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	links: getLinkRows().map(link => ({
		id: link.id,
		kind: link.kind,
		title: link.title,
		url: link.url
	}))
});

export const actions: Actions = {
	create: async ({ request }) => {
		const input = parseLinkForm(await request.formData());
		if (!input.url) {
			return fail(400, { message: 'URL is required' });
		}
		await createLink(input);
		await revalidate();
		return { created: true };
	},
	delete: async ({ request }) => {
		const id = (await request.formData()).get('id');
		if (typeof id !== 'string') {
			return fail(400, { message: 'Missing id' });
		}
		await deleteLink(id);
		await revalidate();
		return { deleted: true };
	}
};

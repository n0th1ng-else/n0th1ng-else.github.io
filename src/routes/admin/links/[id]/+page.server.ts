import { error, fail, redirect } from '@sveltejs/kit';
import { revalidate } from '$lib/server/content';
import { deleteLink, getLinkById, parseLinkForm, updateLink } from '$lib/server/links-repo';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const link = await getLinkById(params.id);
	if (!link) {
		error(404, 'Link not found');
	}
	return {
		link: {
			id: link.id,
			kind: link.kind,
			service: link.service,
			lang: link.lang,
			url: link.url,
			link: link.link,
			title: link.title,
			description: link.description,
			image: link.image,
			note: link.note,
			date: link.date ? new Date(Number(link.date)).toISOString().slice(0, 10) : '',
			sortOrder: link.sort_order
		}
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const input = parseLinkForm(await request.formData());
		if (!input.url) {
			return fail(400, { message: 'URL is required' });
		}
		await updateLink(params.id, input);
		await revalidate();
		return { updated: true };
	},
	delete: async ({ params }) => {
		await deleteLink(params.id);
		await revalidate();
		redirect(303, '/admin/links');
	}
};

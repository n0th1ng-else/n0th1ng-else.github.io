import { error, fail, redirect } from '@sveltejs/kit';
import { revalidate } from '$lib/server/content';
import {
	buildArticleMarkdown,
	deleteArticle,
	getArticleById,
	parseArticleForm,
	updateArticle
} from '$lib/server/articles-repo';
import { openArticlePR } from '$lib/server/github';
import type { Actions, PageServerLoad } from './$types';

const toDateInput = (date: Date | null): string =>
	date ? new Date(date).toISOString().slice(0, 10) : '';

export const load: PageServerLoad = async ({ params, url }) => {
	const article = await getArticleById(params.id);
	if (!article) {
		error(404, 'Article not found');
	}
	return {
		article: {
			slug: article.slug,
			title: article.title,
			language: article.language,
			date: toDateInput(article.date),
			description: article.description,
			image: article.image,
			keywords: article.keywords.join(', '),
			reposts: article.reposts.join(', '),
			bodyMd: article.body_md
		},
		status: article.status,
		source: article.source,
		shareUrl: article.share_token ? `${url.origin}/draft/${article.share_token}` : null
	};
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const input = parseArticleForm(await request.formData());
		if (!input.slug || !input.title) {
			return fail(400, { message: 'Slug and title are required' });
		}
		await updateArticle(params.id, input);
		await revalidate();
		return { saved: true };
	},

	publish: async ({ params }) => {
		const article = await getArticleById(params.id);
		if (!article) {
			error(404, 'Article not found');
		}
		if (!article.title || !article.description || !article.date) {
			return fail(400, { message: 'Title, description and date are required to publish' });
		}
		try {
			const prUrl = await openArticlePR({
				slug: article.slug,
				year: article.date.getFullYear(),
				title: article.title,
				markdown: buildArticleMarkdown(article)
			});
			return { prUrl };
		} catch (err) {
			return fail(500, { message: err instanceof Error ? err.message : 'Publish failed' });
		}
	},

	delete: async ({ params }) => {
		await deleteArticle(params.id);
		await revalidate();
		redirect(303, '/admin');
	}
};

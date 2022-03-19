<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { notFoundRoute } from '../../helpers/routes';
	import { getArticles } from '../../helpers/selectors';
	import { getArticle } from '../../helpers/api';

	export const load: Load = async ({ page }) => {
		const slug = page.params.slug;
		const host = page.host;
		const path = page.path;
		const pageUrl = `${host}${path}`;

		const articles = getArticles();
		const article = articles.find(artcl => artcl.id === slug);

		// TODO make sure to delete this
		try {
			// eslint-disable-next-line no-console
			console.log('url:', pageUrl, host);
			const data = await getArticle(host, slug, true);
			// eslint-disable-next-line no-console
			console.log('Article loaded:', data.id);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Unable to load article:', err);
		}

		if (!article) {
			return {
				headers: {
					Location: notFoundRoute
				},
				redirect: notFoundRoute,
				status: 302
			};
		}

		return {
			props: {
				article,
				pageUrl
			}
		};
	};
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import ArticlePreview from '../../components/ArticlePreview.svelte';
	import Meta from '../../ui/Meta.svelte';
	import { getPageTitle } from '../../labels';
	import { showBack, hideBack } from '../../helpers/navigation';
	import type { LinkInfo } from 'common';

	export let article: LinkInfo;
	export let pageUrl: string;

	const title = getPageTitle(article.meta.title);
	const metaTitle = article.meta.title;
	const metaImage = article.meta.image;

	onMount(() => {
		if (!browser) {
			return;
		}
		showBack();
	});

	onDestroy(() => {
		if (!browser) {
			return;
		}
		hideBack();
	});
</script>

<Meta
	title="{metaTitle}"
	type="article"
	twitterType="summary_large_image"
	image="{metaImage}"
	url="{pageUrl}"
/>

<ArticlePreview article="{article}" showDate readonly="{!browser}" />

<svelte:head>
	<title>{title}</title>
</svelte:head>

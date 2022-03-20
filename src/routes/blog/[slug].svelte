<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { notFoundRoute } from '../../helpers/routes';
	import { getArticle } from '../../helpers/api';
	import { Logger } from '../../helpers/log';

	const logger = new Logger('article:ssr');

	export const load: Load = async ({ page }) => {
		const slug = page.params.slug;
		const host = page.host;
		const path = page.path;
		const pageUrl = `${host}${path}`;

		try {
			const article = await getArticle(host, slug);
			return {
				props: {
					article,
					pageUrl
				}
			};
		} catch (err) {
			logger.error(`Failed to load an article "${slug}"`, err);
			return {
				headers: {
					Location: notFoundRoute
				},
				redirect: notFoundRoute,
				status: 302
			};
		}
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

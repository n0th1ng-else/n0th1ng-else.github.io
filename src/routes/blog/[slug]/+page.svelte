<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { showBack, hideBack } from '$lib/browser/stores/navigation';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import ArticlePreview from '$lib/browser/components/ArticlePreview.svelte';
	import { getPageTitle } from '$lib/common/labels';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url, article } = data;

	const title = getPageTitle(article.meta.title ?? '');
	const metaTitle = article.meta.title ?? '';
	const metaImage = article.meta.image ?? '';

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

<Meta title={metaTitle} type="article" twitterType="summary_large_image" image={metaImage} {url} />

<ArticlePreview {article} showDate readonly={!browser} />

<svelte:head>
	<title>{title}</title>
</svelte:head>

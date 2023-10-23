<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { showBack, hideBack } from '$lib/browser/stores/navigation';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import ArticlePreview from '$lib/browser/components/ArticlePreview.svelte';
	import FullArticle from '$lib/browser/components/FullArticle/FullArticle.svelte';
	import { getPageTitle } from '$lib/common/labels';
	import { isInternalArticle } from '$lib/common/articles';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url, host, article } = data;

	const title = getPageTitle(article.meta.title ?? '');
	const seoTitle = article.meta.title ?? '';
	const seoImage = article.meta.image ?? '';
	const seoDescription = article.meta.description ?? '';
	const internal = isInternalArticle(article);

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
	title="{seoTitle}"
	type="article"
	twitterType="summary_large_image"
	image="{seoImage}"
	description="{seoDescription}"
	{url}
/>

{#if internal}
	<FullArticle {article} />
{:else}
	<ArticlePreview {article} showDate readonly="{!browser}" selfUrl="{host}" />
{/if}

<svelte:head>
	<title>{title}</title>
</svelte:head>

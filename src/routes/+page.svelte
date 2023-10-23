<script lang="ts">
	import { browser } from '$app/environment';
	import { profileStore } from '$lib/browser/stores';
	import { blogRoute } from '$lib/common/routes';
	import Link from '$lib/browser/ui/Link.svelte';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import ArticlePreview from '$lib/browser/components/ArticlePreview.svelte';
	import { homeTitle as title } from '$lib/common/labels';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url, host, article, showDraft } = data;
</script>

<Meta
	image="{$profileStore?.image ?? ''}"
	description="Latest articles, contacts and interesting observations. All in one place. Welcome to my blog."
	{url}
/>

{#if article}
	<ArticlePreview {article} readonly="{!browser}" addDraft="{showDraft}" selfUrl="{host}" />
{/if}

<section class="blog-link">
	<SubTitle inline>
		Find more posts in my <Link inline url="{blogRoute}">Blog</Link>.
	</SubTitle>
</section>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../global';
	.blog-link {
		margin-block-start: $unit;
	}
</style>

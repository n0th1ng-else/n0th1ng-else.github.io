<script lang="ts">
	import { browser } from '$app/environment';
	import { getProfile } from '$lib/browser/stores/profile.svelte';
	import { blogRoute } from '$lib/common/routes';
	import Link from '$lib/browser/ui/Link.svelte';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import ArticlePreview from '$lib/browser/components/ArticlePreview.svelte';
	import { homeTitle as title } from '$lib/common/labels';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let { url, host, article, showDraft } = $derived(data);

	const profile = $derived.by(() => getProfile());
	const profileImage = $derived(profile?.image ?? '');

	const seoTitle = $derived(article ? `Latest in the blog: ${article.meta.title}` : undefined);
	const seoDescription = $derived(
		article
			? article.meta.description
			: 'Latest articles, contacts and interesting observations. All in one place.'
	);
</script>

<Meta image={profileImage} title={seoTitle} description={seoDescription} {url} />

{#if article}
	<ArticlePreview {article} readonly={!browser} addDraft={showDraft} selfUrl={host} />
{/if}

<section class="blog-link">
	<SubTitle inline>
		Find more posts in my <Link inline url={blogRoute}>Blog</Link>.
	</SubTitle>
</section>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@use '../global' as g;

	.blog-link {
		margin-block-start: g.$unit;
	}
</style>

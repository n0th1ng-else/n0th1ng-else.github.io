<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.title} (draft)</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<article class="draft">
	<p class="draft__badge">Draft preview</p>
	<h1>{data.title}</h1>
	{#if data.description}
		<p class="draft__description">{data.description}</p>
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="draft__content">{@html data.content}</div>
</article>

<style lang="scss">
	@use '../../../global' as g;

	.draft {
		max-width: 50rem;
		margin-inline: auto;
		padding-block: g.$unit;
	}

	.draft__badge {
		display: inline-block;
		font-size: 0.8em;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.7;
	}
</style>

<script lang="ts">
	import ArticleForm from '$lib/browser/admin/ArticleForm.svelte';
	import type { ActionData } from './$types';

	const { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin · New article</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="article">
	<p><a href="/admin">← Admin</a></p>
	<h1>New article</h1>
	{#if form?.message}
		<p class="article__error">{form.message}</p>
	{/if}
	<ArticleForm action="" submitLabel="Create draft" />
</section>

<style lang="scss">
	@use '../../../../global' as g;

	.article {
		max-width: 60rem;
		margin-inline: auto;
		padding-block: g.$unit;
	}

	.article__error {
		color: red;
	}
</style>

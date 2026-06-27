<script lang="ts">
	import { enhance } from '$app/forms';
	import ArticleForm from '$lib/browser/admin/ArticleForm.svelte';
	import type { PageData, ActionData } from './$types';

	const { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin · Edit article</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="article">
	<p><a href="/admin">← Admin</a></p>
	<h1>Edit article <span class="article__tag">{data.status} · {data.source}</span></h1>

	{#if form?.saved}
		<p class="article__notice">Saved.</p>
	{/if}
	{#if form?.message}
		<p class="article__error">{form.message}</p>
	{/if}
	{#if form?.prUrl}
		<p class="article__notice">
			PR opened: <a href={form.prUrl} target="_blank" rel="noreferrer">{form.prUrl}</a>
		</p>
	{/if}

	{#if data.shareUrl}
		<p class="article__share">
			Private preview: <a href={data.shareUrl} target="_blank" rel="noreferrer">{data.shareUrl}</a>
		</p>
	{/if}

	<ArticleForm action="?/save" value={data.article} submitLabel="Save draft" />

	<div class="article__ops">
		<form method="POST" action="?/publish" use:enhance>
			<button type="submit">Publish (open PR)</button>
		</form>
		<form method="POST" action="?/delete" use:enhance>
			<button type="submit">Delete</button>
		</form>
	</div>
</section>

<style lang="scss">
	@use '../../../../global' as g;

	.article {
		max-width: 60rem;
		margin-inline: auto;
		padding-block: g.$unit;
	}

	.article__tag {
		font-size: 0.7em;
		opacity: 0.7;
	}

	.article__error {
		color: red;
	}

	.article__ops {
		display: flex;
		gap: g.$unit;
		margin-block-start: g.$unit;
	}
</style>

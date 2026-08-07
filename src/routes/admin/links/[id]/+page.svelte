<script lang="ts">
	import { enhance } from '$app/forms';
	import LinkForm from '$lib/browser/admin/LinkForm.svelte';
	import type { PageData, ActionData } from './$types';

	const { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin · Edit link</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="link">
	<p><a href="/admin/links">← Links</a></p>
	<h1>Edit link</h1>

	{#if form?.updated}
		<p class="link__notice">Saved.</p>
	{/if}
	{#if data.link.hidden}
		<p class="link__notice">This link is hidden from the public pages.</p>
	{/if}

	<LinkForm action="?/update" value={data.link} submitLabel="Save changes" />

	<form method="POST" action="?/toggle" use:enhance class="link__delete">
		<button type="submit"
			>{data.link.hidden ? 'Show on public pages' : 'Hide from public pages'}</button
		>
	</form>

	<form method="POST" action="?/delete" use:enhance class="link__delete">
		<button type="submit">Delete this link</button>
	</form>
</section>

<style lang="scss">
	@use '../../../../global' as g;

	.link {
		max-width: 60rem;
		margin-inline: auto;
		padding-block: g.$unit;
	}

	.link__delete {
		margin-block-start: g.$unit;
	}
</style>

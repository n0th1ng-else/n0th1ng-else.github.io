<script lang="ts">
	import { enhance } from '$app/forms';
	import LinkForm from '$lib/browser/admin/LinkForm.svelte';
	import type { PageData, ActionData } from './$types';

	const { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin · Links</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="links">
	<p><a href="/admin">← Admin</a></p>
	<h1>Links</h1>

	{#if form?.created}
		<p class="links__notice">Link added.</p>
	{/if}
	{#if form?.deleted}
		<p class="links__notice">Link deleted.</p>
	{/if}
	{#if form?.toggled}
		<p class="links__notice">Link visibility updated.</p>
	{/if}

	<h2>Add link</h2>
	<LinkForm action="?/create" submitLabel="Add link" />

	<h2>Existing ({data.links.length})</h2>
	<ul class="links__list">
		{#each data.links as link (link.id)}
			<li class:links__item--hidden={link.hidden}>
				<span class="links__tag">{link.kind}</span>
				<a href={`/admin/links/${link.id}`}>{link.title || link.url}</a>
				{#if link.hidden}
					<span class="links__tag">hidden</span>
				{/if}
				<form method="POST" action="?/toggle" use:enhance class="links__actions">
					<input type="hidden" name="id" value={link.id} />
					<button type="submit">{link.hidden ? 'Show' : 'Hide'}</button>
				</form>
				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="id" value={link.id} />
					<button type="submit">Delete</button>
				</form>
			</li>
		{:else}
			<li class="links__empty">No links yet.</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@use '../../../global' as g;

	.links {
		max-width: 60rem;
		margin-inline: auto;
		padding-block: g.$unit;
	}

	.links__list {
		list-style: none;
		padding: 0;

		li {
			display: flex;
			align-items: center;
			gap: g.$unit-half;
			padding-block: g.$unit-eighth;
		}
	}

	.links__tag {
		font-size: 0.8em;
		opacity: 0.7;
	}

	.links__actions {
		margin-inline-start: auto;
	}

	.links__item--hidden > a {
		opacity: 0.5;
	}

	.links__empty {
		opacity: 0.6;
	}
</style>

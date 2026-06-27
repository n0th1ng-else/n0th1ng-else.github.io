<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	const { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="admin">
	<header class="admin__head">
		<h1>Admin</h1>
		<div class="admin__actions">
			<form method="POST" action="?/revalidate" use:enhance>
				<button type="submit">Revalidate cache</button>
			</form>
			<form method="POST" action="/admin/logout" use:enhance>
				<button type="submit">Log out</button>
			</form>
		</div>
	</header>

	{#if form?.revalidated}
		<p class="admin__notice">Cache revalidated.</p>
	{/if}

	<p class="admin__counts">
		Loaded: {data.counts.articles} articles · {data.counts.publications} publications · {data.counts
			.packages} packages · {data.counts.readingList} reading-list
	</p>

	<nav class="admin__nav">
		<a href="/admin/links">Manage links</a>
		<a href="/admin/articles/new">New article</a>
	</nav>

	<h2>Articles ({data.articles.length})</h2>
	<ul class="admin__list">
		{#each data.articles as article (article.id)}
			<li>
				<a href={`/admin/articles/${article.id}`}>{article.title}</a>
				<span class="admin__tag">{article.status}</span>
				<span class="admin__tag">{article.source}</span>
			</li>
		{:else}
			<li class="admin__empty">No articles.</li>
		{/each}
	</ul>

	<h2>Links ({data.links.length})</h2>
	<ul class="admin__list">
		{#each data.links as link (link.id)}
			<li>
				<span class="admin__tag">{link.kind}</span>
				<a href={`/admin/links/${link.id}`}>{link.title || link.url}</a>
			</li>
		{:else}
			<li class="admin__empty">No links.</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@use '../../global' as g;

	.admin {
		max-width: 60rem;
		margin-inline: auto;
		padding-block: g.$unit;
	}

	.admin__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.admin__actions {
		display: flex;
		gap: g.$unit-half;
	}

	.admin__counts {
		margin-block: g.$unit-half;
	}

	.admin__nav {
		display: flex;
		gap: g.$unit;
		margin-block: g.$unit-half;
	}

	.admin__list {
		list-style: none;
		padding: 0;

		li {
			padding-block: g.$unit-eighth;
		}
	}

	.admin__tag {
		display: inline-block;
		font-size: 0.8em;
		opacity: 0.7;
		margin-inline: g.$unit-eighth;
	}

	.admin__empty {
		opacity: 0.6;
	}
</style>

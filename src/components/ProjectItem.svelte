<script lang="ts">
	import Link from '../ui/Link.svelte';
	import type { ProjectItem } from '../helpers/projects';
	export let item: ProjectItem;
	console.log(item);
</script>

<div class="project">
	{#if item.logo}
		<div class="project__logo-container">
			<img class="project__logo" src="{item.logo}" alt="" />
		</div>
	{/if}
	<div>
		<Link external url="{item.url}">{item.name}</Link>
	</div>
	{#if item.tags}
		<div>
			{#each item.tags as tag (tag)}
				<span>#{tag}</span>
			{/each}
		</div>
	{/if}
	{#if item.description}
		<div>
			{item.description}
		</div>
	{/if}
</div>

<style lang="scss">
	@import '../global';

	.project {
		align-items: center;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
		padding: $unit-plus;

		&__logo-container {
			height: 10 * $unit-quarter;
			width: 10 * $unit-half;
		}

		&__logo {
			height: 100%;
			object-fit: contain;
			width: 100%;
		}
	}
</style>

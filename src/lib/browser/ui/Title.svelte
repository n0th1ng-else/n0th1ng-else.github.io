<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		centered = true,
		children
	}: {
		centered?: boolean;
		children: Snippet;
	} = $props();
</script>

<header>
	<h1 class="title" class:centered>{@render children()}</h1>
</header>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.title {
		@include t.set-font();
		font-size: g.$font-size-big;
		font-weight: g.$font-weight;
		margin: 0;
		padding-block: (g.$unit-double + g.$unit-half) g.$unit-plus;
		padding-inline: 0;
		text-transform: capitalize;

		&.centered {
			text-align: center;
		}
	}
</style>

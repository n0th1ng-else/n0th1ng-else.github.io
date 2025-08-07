<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		type = 'regular',
		children
	}: {
		type?: 'regular' | 'header';
		children: Snippet;
	} = $props();
</script>

<ul class="ui-list" class:ui-list--header={type === 'header'}>
	{@render children()}
</ul>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.ui-list {
		@include t.set-font();
		list-style-type: none;
		margin: 0;
		padding: 0;
		&--header {
			display: flex;
			font-weight: g.$font-weight-light;
		}
	}
</style>

<script lang="ts">
	import { type Snippet } from 'svelte';
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();

	let isDark = $derived.by(() => isDarkTheme());
</script>

<li class="ui-list-item" class:l={!isDark} class:d={isDark}>
	{@render children()}
</li>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	@mixin list-item($primary, $secondary) {
		&:before {
			@include t.smooth-change(color);
			color: $primary;
		}

		&:hover {
			&:before {
				color: $secondary;
			}
		}
	}

	.ui-list-item {
		@include t.set-font();

		padding-block: g.$unit-quarter;
		padding-inline: 0;

		&:before {
			content: '\2022';
			font-size: g.$font-size-bigger;
			line-height: 0.5;
			padding-inline-end: g.$unit-half;
			vertical-align: middle;
		}

		&.l {
			@include list-item(t.$l-tertiary, t.$l-accent);
		}

		&.d {
			@include list-item(t.$d-tertiary, t.$d-accent);
		}
	}
</style>

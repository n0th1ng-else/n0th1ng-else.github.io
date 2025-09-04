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

<h3 class="ui-lower-sub" class:l={!isDark} class:d={isDark}>
	{@render children()}
</h3>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	@mixin subtitle-style($color) {
		@include t.smooth-change(color);

		color: $color;
	}

	.ui-lower-sub {
		@include t.set-font();

		margin: 0;
		font-size: g.$font-size-big;
		font-weight: g.$font-weight;

		&.l {
			@include subtitle-style(t.$l-primary);
		}

		&.d {
			@include subtitle-style(t.$d-primary);
		}
	}
</style>

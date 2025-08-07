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

<footer class="ui-footer-wrapper">
	<div class="ui-footer" class:l={!isDark} class:d={isDark}>
		{@render children()}
	</div>
</footer>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	@mixin border-style($color) {
		@include t.smooth-change(border-color);

		border-color: $color;
	}

	.ui-footer-wrapper {
		display: flex;
		justify-content: center;
	}

	.ui-footer {
		@include t.set-font();
		border-top: 1px solid;
		display: flex;
		flex: 0 1 g.$max-content-width;
		flex-direction: column;
		margin-block-start: g.$unit-triple;
		padding-block: g.$unit-double;
		padding-inline: 0;

		&.l {
			@include border-style(t.$l-secondary);
		}

		&.d {
			@include border-style(t.$d-secondary);
		}
	}
</style>

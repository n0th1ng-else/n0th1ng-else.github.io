<script lang="ts">
	import { type Snippet } from 'svelte';
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';

	let {
		full = false,
		children
	}: {
		full?: boolean;
		children: Snippet;
	} = $props();

	let isDark = $derived.by(() => isDarkTheme());
</script>

<div class:l={!isDark} class:d={isDark} class="ui-container" class:full-screen={full}>
	{@render children()}
</div>

<style lang="scss">
	@use './theme' as t;

	@mixin container-style($color, $background-color) {
		@include t.smooth-change(background-color, color);

		background-color: $background-color;
		color: $color;
	}

	.ui-container {
		@include t.set-font();
		line-height: 1.5;
		&.full-screen {
			min-height: 100vh;
		}

		&.l {
			@include container-style(t.$l-primary, t.$l-background);
		}

		&.d {
			@include container-style(t.$d-primary, t.$d-background);
		}
	}
</style>

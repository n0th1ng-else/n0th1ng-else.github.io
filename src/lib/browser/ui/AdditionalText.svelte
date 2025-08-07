<script lang="ts">
	import { type Snippet } from 'svelte';
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';

	let {
		small = false,
		children
	}: {
		small?: boolean;
		children: Snippet;
	} = $props();

	let isDark = $derived.by(() => isDarkTheme());
</script>

<span class="ui-additional-text" class:l={!isDark} class:d={isDark} class:small>
	{@render children()}
</span>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.ui-additional-text {
		@include t.set-font();
		&.small {
			font-size: g.$font-size-smaller;
		}
		&.l {
			@include t.text-style(t.$l-secondary);
		}

		&.d {
			@include t.text-style(t.$d-secondary);
		}
	}
</style>

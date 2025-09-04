<script lang="ts">
	import { type Snippet } from 'svelte';
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';

	let {
		url = 'javascript:void(0);',
		active = false,
		label = '',
		children
	}: {
		url?: string;
		active?: boolean;
		label?: string;
		children: Snippet;
	} = $props();

	let isDark = $derived.by(() => isDarkTheme());
</script>

<a
	class="ui-header-link"
	class:active
	class:l={!isDark}
	class:d={isDark}
	href={url}
	aria-label={label}
>
	{@render children()}
</a>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	@mixin link-style($primary, $secondary) {
		@include t.smooth-change(color);

		color: $primary;

		&:hover {
			color: $secondary;
		}

		&.active {
			color: $secondary;
		}
	}

	.ui-header-link {
		@include t.set-font();
		margin: g.$unit-half;
		text-decoration: none;
		&.l {
			@include link-style(t.$l-primary, t.$l-accent);
		}
		&.d {
			@include link-style(t.$d-primary, t.$d-accent);
		}
	}
</style>

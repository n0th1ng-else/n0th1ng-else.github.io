<script lang="ts">
	import { type Snippet } from 'svelte';
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';

	let {
		url,
		onClick,
		external = false,
		inline = false,
		hint,
		raw = false,
		printVisible = true,
		children
	}: {
		url: string;
		onClick?: VoidFunction;
		external?: boolean;
		inline?: boolean;
		hint?: string;
		raw?: boolean;
		printVisible?: boolean;
		children: Snippet;
	} = $props();

	let isDark = $derived.by(() => isDarkTheme());
</script>

{#if external}
	<a
		class="ui-link"
		class:filled={!raw}
		class:inline
		class:l={!isDark}
		class:d={isDark}
		onclick={onClick}
		href={url}
		title={hint}
		target="_blank"
		rel="noreferrer noopener"
	>
		{@render children()}
	</a>
{:else}
	<a
		class="ui-link"
		class:filled={!raw}
		class:l={!isDark}
		class:d={isDark}
		class:inline
		class:no-print={!printVisible}
		onclick={onClick}
		href={url}
		title={hint}
	>
		{@render children()}
	</a>
{/if}

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.ui-link {
		@include t.set-font();
		margin: g.$unit-half;
		text-decoration: none;

		&.inline {
			margin: 0;
		}
		@media print {
			&.no-print {
				display: none;
			}
		}
	}

	.filled {
		&.l {
			@include t.link-style(t.$l-tertiary, t.$l-accent);
		}

		&.d {
			@include t.link-style(t.$d-tertiary, t.$d-accent);
		}
	}
</style>

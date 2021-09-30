<script lang="ts">
	import { onDestroy } from 'svelte';
	import { link } from 'svelte-spa-router';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	export let external = false;
	export let inline = false;
	export let url = 'javascript:void(0);';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

{#if external}
	<a
		class="ui-link"
		class:inline
		class:l="{!isDark}"
		class:d="{isDark}"
		href="{url}"
		target="_blank"
		rel="noreferrer noopener"
	>
		<slot />
	</a>
{:else}
	<a
		class="ui-link"
		class:inline
		class:l="{!isDark}"
		class:d="{isDark}"
		href="{url}"
		use:link="{url}"
	>
		<slot />
	</a>
{/if}

<style lang="scss">
	@import './theme';
	@import '../global';

	@mixin link-style($primary, $secondary) {
		@include smooth-change-fast(color);

		color: $primary;

		&:visited {
			color: darken($primary, 10%);
		}

		&:hover {
			color: $secondary;
		}
	}

	.ui-link {
		@include set-font();
		margin: $unit-half;
		text-decoration: none;

		&.inline {
			margin: 0;
		}

		&.l {
			@include link-style($l-tertiary, $l-accent);
		}

		&.d {
			@include link-style($d-tertiary, $d-accent);
		}
	}
</style>

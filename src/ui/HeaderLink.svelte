<script lang="ts">
	import { onDestroy } from 'svelte';
	import { link } from 'svelte-spa-router';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	export let url = 'javascript:void(0);';
	export let active = false;

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<a
	class="ui-header-link"
	class:active
	class:l="{!isDark}"
	class:d="{isDark}"
	href="{url}"
	use:link="{url}"
>
	<slot />
</a>

<style lang="scss">
	@import './theme';
	@import '../global';

	@mixin link-style($primary, $secondary) {
		@include smooth-change(color);

		color: $primary;

		&:hover {
			color: $secondary;
		}

		&.active {
			color: $secondary;
		}
	}

	.ui-header-link {
		margin: $unit-half;
		text-decoration: none;
		&.l {
			@include link-style($l-primary, $l-accent);
		}
		&.d {
			@include link-style($d-primary, $d-accent);
		}
	}
</style>

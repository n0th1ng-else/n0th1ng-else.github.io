<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<span class="ui-additional-text" class:l="{!isDark}" class:d="{isDark}">
	<slot />
</span>

<style lang="scss">
	@import '../global';
	@import './theme';

	@mixin text-style($color) {
		@include smooth-change(color);
		color: $color;
	}

	.ui-additional-text {
		&.l {
			@include text-style($l-secondary);
		}

		&.d {
			@include text-style($d-secondary);
		}
	}
</style>

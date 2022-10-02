<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme, defaultTheme } from '$lib/browser/stores/theme';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<h3 class="ui-lower-sub" class:l="{!isDark}" class:d="{isDark}">
	<slot />
</h3>

<style lang="scss">
	@import './theme';
	@import '../../../global';

	@mixin subtitle-style($color) {
		@include smooth-change(color);

		color: $color;
	}

	.ui-lower-sub {
		@include set-font();

		margin: 0;
		font-size: $font-size-big;
		font-weight: $font-weight;

		&.l {
			@include subtitle-style($l-primary);
		}

		&.d {
			@include subtitle-style($d-primary);
		}
	}
</style>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme } from '$lib/browser/stores/theme';

	let isDark = true;

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());

	export let small = false;
</script>

<span class="ui-additional-text" class:l="{!isDark}" class:d="{isDark}" class:small>
	<slot />
</span>

<style lang="scss">
	@import './theme';
	@import '../../../global';

	@mixin text-style($color) {
		@include smooth-change(color);
		color: $color;
	}

	.ui-additional-text {
		@include set-font();
		&.small {
			font-size: $font-size-smaller;
		}
		&.l {
			@include text-style($l-secondary);
		}

		&.d {
			@include text-style($d-secondary);
		}
	}
</style>

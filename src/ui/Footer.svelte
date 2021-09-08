<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<footer class="ui-footer-wrapper">
	<div class="ui-footer" class:l="{!isDark}" class:d="{isDark}">
		<slot />
	</div>
</footer>

<style lang="scss">
	@import '../global';
	@import './theme';

	@mixin border-style($color) {
		@include smooth-change(border-color);

		border-color: $color;
	}

	.ui-footer-wrapper {
		display: flex;
		justify-content: center;
	}

	.ui-footer {
		border-top: 1px solid;
		display: flex;
		flex: 0 1 $max-content-width;
		flex-direction: column;
		margin-top: $unit-triple;
		padding: $unit-double 0;

		&.l {
			@include border-style($l-secondary);
		}

		&.d {
			@include border-style($d-secondary);
		}
	}
</style>

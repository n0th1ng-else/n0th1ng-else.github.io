<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';
	import Button from '../ui/Button.svelte';
	import iconUp from '../assets/icons/arrow-up.svg';
	import iconLeft from '../assets/icons/arrow-left.svg';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	const dispatch = createEventDispatcher();
	const onClick = (): void => dispatch('click');

	export let type: 'up' | 'left' = 'up';
	export let size: 'sm' | 'md' | 'lg' = 'lg';

	const icon = type === 'up' ? iconUp : iconLeft;

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<Button secondary on:click="{onClick}">
	<div class="btn-logo-container {size}">
		<img class="btn-logo" class:l="{!isDark}" class:d="{isDark}" src="{icon}" alt="" />
	</div>
</Button>

<style lang="scss">
	@import '../global';
	@import '../ui/theme';

	.btn-logo-container {
		&.lg {
			height: $unit-triple;
			width: $unit-triple;
		}
		&.md {
			height: $unit-double;
			width: $unit-double;
		}
		&.sm {
			height: $unit-plus;
			width: $unit-plus;
		}
	}

	.btn-logo {
		@include smooth-change(filter, transform);

		height: 100%;
		object-fit: contain;
		width: 100%;

		&.l {
			@include draw-image-black();
		}

		&.d {
			@include draw-image-white();
		}
	}
</style>

<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';
	import { onThemeChange, isDarkTheme } from '$lib/browser/stores/theme';
	import Button from '$lib/browser/ui/Button.svelte';

	import iconUp from '../../../assets/icons/arrow-up.svg';
	import iconLeft from '../../../assets/icons/arrow-left.svg';

	const dispatch = createEventDispatcher();
	const onClick = (): void => {
		dispatch('click');
	};

	export let type: 'up' | 'left' = 'up';
	export let size: 'sm' | 'md' | 'lg' = 'lg';
	export let hint: string | undefined = undefined;

	const icon = type === 'up' ? iconUp : iconLeft;

	const control = false;

	let isDark = true;

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<Button secondary on:click="{onClick}" {control} {hint}>
	<img class="btn-logo {size}" class:l="{!isDark}" class:d="{isDark}" src="{icon}" alt="" />
</Button>

<style lang="scss">
	@import '../ui/theme';
	@import '../../../global';

	.btn-logo {
		@include smooth-change(filter, transform);

		&.l {
			@include draw-image-black();
		}

		&.d {
			@include draw-image-white();
		}

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
</style>

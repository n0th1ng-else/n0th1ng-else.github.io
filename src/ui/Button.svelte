<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';
	import { noop } from '../types';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());

	export let onClick = noop;

	export let secondary = false;

	export let icon = '';

	export let hint = '';
</script>

<button
	class:l="{!isDark}"
	class:d="{isDark}"
	class:secondary
	class="ui-button"
	on:click="{onClick}"
	title="{hint}"
>
	{#if icon}
		<img src="{icon}" class="icon" alt="{hint}" />
	{:else}
		<slot />
	{/if}
</button>

<style lang="scss">
	@import './theme';
	@import '../global';

	@mixin button-style($primary, $secondary) {
		@include smooth-change(background-color, color);

		border-color: $primary;
		color: $primary;

		&:hover {
			border-color: $secondary;
			color: $secondary;
		}
	}

	.ui-button {
		background-color: transparent;
		border: 1px solid;
		cursor: pointer;
		padding: $unit-half;

		&.secondary {
			border: 0;
			padding: 0 $unit-half;
		}

		&.l {
			@include button-style($l-primary, $l-accent);
		}

		&.d {
			@include button-style($d-primary, $d-accent);
		}
	}

	.icon {
		height: $unit;
		object-fit: contain;
		width: $unit;
	}
</style>

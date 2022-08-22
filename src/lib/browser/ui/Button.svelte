<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';
	import { onThemeChange, isDarkTheme, defaultTheme } from '$lib/browser/stores/theme';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());

	const dispatch = createEventDispatcher();

	const onClick = (): void => {
		dispatch('click');
	};

	export let secondary = false;

	export let inline = false;

	export let icon = '';

	export let hint = '';

	export let disabled = false;

	export let href = '';
</script>

{#if href}
	<a
		class:l="{!isDark}"
		class:d="{isDark}"
		class:secondary
		class:inline
		class="ui-button"
		on:click="{onClick}"
		title="{hint}"
		href="{href}"
	>
		<span class="ui-button__text">
			<slot />
		</span>
		{#if icon}
			<img src="{icon}" class="ui-button__icon" alt="{hint}" />
		{/if}
	</a>
{:else}
	<button
		class:l="{!isDark}"
		class:d="{isDark}"
		class:secondary
		class:inline
		class="ui-button"
		on:click="{onClick}"
		title="{hint}"
		disabled="{disabled}"
	>
		<span class="ui-button__text">
			<slot />
		</span>
		{#if icon}
			<img src="{icon}" class="ui-button__icon" alt="{hint}" />
		{/if}
	</button>
{/if}

<style lang="scss">
	@import './theme';
	@import '../../../global';

	@mixin button-style($primary, $secondary) {
		@include smooth-change(border-color, color);

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
		display: flex;
		padding: $unit-half;
		text-decoration: none;

		&.secondary {
			border: 0;
			padding: 0 $unit-half;
		}
		&.inline {
			border: 0;
			display: inline;
			padding: 0;
		}

		&.l {
			@include button-style($l-primary, $l-accent);
		}

		&.d {
			@include button-style($d-primary, $d-accent);
		}

		&__text {
			@include set-font();
			font-size: $font-size-small;
			text-transform: capitalize;
		}

		&__icon {
			height: $unit;
			object-fit: contain;
			width: $unit;
		}
	}
</style>

<script lang="ts">
	import { type Snippet } from 'svelte';
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';
	import type { IconSize } from '$lib/browser/ui/types';
	import Link from './Link.svelte';

	let isDark = $derived.by(() => isDarkTheme());

	type Props =
		| {
				onClick: VoidFunction;
				disabled?: boolean;
		  }
		| {
				href: string;
				external?: boolean;
				onClick?: VoidFunction;
		  };

	let props: Props & {
		secondary?: boolean;
		inline?: boolean;
		icon?: string;
		iconOutline?: boolean;
		iconSize?: IconSize;
		hint?: string;
		printVisible?: boolean;
		children?: Snippet;
	} = $props();

	const secondary = $derived(props.secondary ?? false);

	const inline = $derived(props.inline ?? false);

	const icon = $derived(props.icon ?? '');

	const iconOutline = $derived(props.iconOutline ?? false);

	const iconSize = $derived(props.iconSize ?? 'sm');

	const disabled = $derived('disabled' in props ? props.disabled : false);

	const href = $derived('href' in props ? props.href : '');

	const external = $derived('external' in props ? props.external : false);

	const printVisible = $derived(props.printVisible ?? true);
</script>

{#if href}
	<Link onClick={props.onClick} {external} url={href} hint={props.hint} raw inline {printVisible}>
		<span class:l={!isDark} class:d={isDark} class:secondary class:inline class="ui-button">
			{#if props.children}
				<span class="ui-button__text">
					{@render props.children()}
				</span>
			{/if}
			{#if props.icon}
				<img
					src={props.icon}
					class:outline={iconOutline}
					class="ui-button__icon {iconSize}"
					alt={props.hint}
				/>
			{/if}
		</span>
	</Link>
{:else}
	<button
		class="ui-button"
		class:l={!isDark}
		class:d={isDark}
		class:secondary
		class:inline
		class:no-print={!printVisible}
		onclick={props.onClick}
		title={props.hint}
		{disabled}
	>
		{#if props.children}
			<span class="ui-button__text">
				{@render props.children()}
			</span>
		{/if}
		{#if icon}
			<img
				src={icon}
				class:outline={iconOutline}
				class="ui-button__icon {iconSize}"
				alt={props.hint}
			/>
		{/if}
	</button>
{/if}

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	@mixin button-style($primary, $secondary, $active) {
		@include t.smooth-change(border-color, color);

		border-color: $primary;
		color: $primary;

		&:hover {
			border-color: $secondary;
			color: $secondary;
		}

		&:active {
			background-color: $active;
		}
	}

	.ui-button {
		background-color: transparent;
		border: 1px solid;
		cursor: pointer;
		display: flex;
		padding: g.$unit-half;
		text-decoration: none;

		&.secondary {
			border: 0;
			border-radius: g.$unit-half;
			padding: g.$unit-quarter g.$unit-quarter;
		}

		&.inline {
			border: 0;
			display: inline;
			padding: 0;
		}

		@media print {
			&.no-print {
				display: none;
			}
		}

		&.l {
			@include button-style(t.$l-button-primary, t.$l-button-accent, t.$l-button-active);

			.outline {
				@include t.draw-image-black();
			}
		}

		&.d {
			@include button-style(t.$d-button-primary, t.$d-button-accent, t.$d-button-active);

			.outline {
				@include t.draw-image-white();
			}
		}

		&__text {
			@include t.set-font();
			font-size: g.$font-size-small;
		}

		&__icon {
			object-fit: contain;
			vertical-align: middle;
			@include t.smooth-change(filter, transform);

			&.xl {
				height: g.$unit-triple;
				width: g.$unit-triple;
			}
			&.lg {
				height: g.$unit-double;
				width: g.$unit-double;
			}
			&.md {
				height: g.$unit-plus;
				width: g.$unit-plus;
			}
			&.sm {
				height: g.$unit;
				width: g.$unit;
			}
		}
	}
</style>

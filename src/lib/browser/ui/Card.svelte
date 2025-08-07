<script lang="ts">
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';
	import { getPositionTitle } from '$lib/common/labels';
	import Button from '$lib/browser/ui/Button.svelte';
	import Tag from '$lib/browser/ui/Tag.svelte';
	import AdditionalText from '$lib/browser/ui/AdditionalText.svelte';
	import LowerTitle from '$lib/browser/ui/LowerTitle.svelte';
	import type { ProjectItem } from '../utils/projects';

	let {
		item,
		readonly = false,
		extended = false
	}: {
		item: ProjectItem;
		readonly?: boolean;
		extended?: boolean;
	} = $props();

	let isDark = $derived.by(() => isDarkTheme());
</script>

<section class="ui-card" class:l={!isDark} class:d={isDark}>
	{#if item.logo}
		<p class="ui-card__logo-container">
			<img class="ui-card__logo" src={item.logo} alt="" />
		</p>
	{/if}
	{#if !item.logo || extended}
		<div class="ui-card__section ui-card__title ui-card__text">
			<LowerTitle>{item.name}</LowerTitle>
		</div>
	{/if}
	{#if getPositionTitle(item.position)}
		<p class="ui-card__text ui-card__section">
			<AdditionalText>{getPositionTitle(item.position)}</AdditionalText>
		</p>
	{/if}
	<div class="ui-card__actions ui-card__section">
		{#if item.url}
			<p class="ui-card__action">
				<Button href={item.url} disabled={readonly} external>Website</Button>
			</p>
		{/if}
		{#if item.source}
			<p class="ui-card__action">
				<Button href={item.source} disabled={readonly} external>Source</Button>
			</p>
		{/if}
		{#if item.registry}
			<p class="ui-card__action">
				<Button href={item.registry} disabled={readonly} external>Package</Button>
			</p>
		{/if}
	</div>
	{#if item.tags}
		<div class="ui-card__actions ui-card__section">
			{#each item.tags as tag (tag)}
				<div class="ui-card__action">
					<Tag title={tag} />
				</div>
			{/each}
		</div>
	{/if}
	{#if item.description}
		<p class="ui-card__text ui-card__section">
			<AdditionalText>{item.description}</AdditionalText>
		</p>
	{/if}
</section>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	@mixin card-style($border, $background) {
		@include t.smooth-change(background-color, border-color);

		background-color: $background;
		border-color: $border;
	}

	.ui-card {
		border: g.$unit-eighth solid black;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		padding-block: g.$unit;
		padding-inline: g.$unit-half;

		&.l {
			@include card-style(t.$cl-black-light, t.$cl-grey-lighter);
		}

		&.d {
			@include card-style(t.$cl-black-light, t.$cl-blue-dark);
		}

		&__logo-container {
			height: 10 * g.$unit-quarter;
			margin-block: 0 g.$unit;
			margin-inline: auto;
			width: 10 * g.$unit-half;
		}

		&__logo {
			height: 100%;
			object-fit: contain;
			width: 100%;
		}

		&__actions {
			display: flex;
			justify-content: center;
			gap: g.$unit-plus;

			@media (min-width: t.$md) {
				gap: 0;
			}
		}

		&__action {
			margin-block: 0;
			margin-inline: g.$unit-quarter;
		}

		&__text {
			text-align: center;
		}

		&__section {
			margin-block-end: g.$unit;
		}

		&__title {
			margin-block-end: g.$unit-plus;
		}
	}
</style>

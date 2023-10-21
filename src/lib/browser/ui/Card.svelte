<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme } from '$lib/browser/stores/theme';
	import { getPositionTitle } from '$lib/common/labels';
	import Button from './Button.svelte';
	import Tag from './Tag.svelte';
	import AdditionalText from './AdditionalText.svelte';
	import LowerTitle from './LowerTitle.svelte';
	import type { ProjectItem } from '../utils/projects';

	export let item: ProjectItem;
	export let readonly = false;
	export let extended = false;

	let isDark = true;

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<section class="ui-card" class:l="{!isDark}" class:d="{isDark}">
	{#if item.logo}
		<p class="ui-card__logo-container">
			<img class="ui-card__logo" src="{item.logo}" alt="" />
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
				<Button href="{item.url}" disabled="{readonly}" external>Website</Button>
			</p>
		{/if}
		{#if item.source}
			<p class="ui-card__action">
				<Button href="{item.source}" disabled="{readonly}" external>Source</Button>
			</p>
		{/if}
		{#if item.registry}
			<p class="ui-card__action">
				<Button href="{item.registry}" disabled="{readonly}" external>Package</Button>
			</p>
		{/if}
	</div>
	{#if item.tags}
		<div class="ui-card__actions ui-card__section">
			{#each item.tags as tag (tag)}
				<div class="ui-card__action">
					<Tag title="{tag}" />
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
	@import './theme';
	@import '../../../global';

	@mixin card-style($border, $background) {
		@include smooth-change(background-color, border-color);

		background-color: $background;
		border-color: $border;
	}

	.ui-card {
		border: $unit-eighth solid black;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		padding-block: $unit;
		padding-inline: $unit-half;

		&.l {
			@include card-style($cl-black-light, $cl-grey-lighter);
		}

		&.d {
			@include card-style($cl-black-light, $cl-blue-dark);
		}

		&__logo-container {
			height: 10 * $unit-quarter;
			margin-block: 0 $unit;
			margin-inline: auto;
			width: 10 * $unit-half;
		}

		&__logo {
			height: 100%;
			object-fit: contain;
			width: 100%;
		}

		&__actions {
			display: flex;
			justify-content: center;
			gap: $unit-plus;

			@media (min-width: $md) {
				gap: 0;
			}
		}

		&__action {
			margin-block: 0;
			margin-inline: $unit-quarter;
		}

		&__text {
			text-align: center;
		}

		&__section {
			margin-block-end: $unit;
		}

		&__title {
			margin-block-end: $unit-plus;
		}
	}
</style>

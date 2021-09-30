<script lang="ts">
	import { onDestroy } from 'svelte';
	import Button from './Button.svelte';
	import Tag from './Tag.svelte';
	import AdditionalText from './AdditionalText.svelte';
	import { openUrl } from '../helpers/links';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';
	import type { ProjectItem } from '../helpers/projects';
	import { getPositionTitle } from '../labels';

	export let item: ProjectItem;
	export let readonly = false;

	const onClick = (url: string) => () => openUrl(url);

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<div class="ui-card" class:l="{!isDark}" class:d="{isDark}">
	{#if item.logo}
		<div class="ui-card__logo-container">
			<img class="ui-card__logo" src="{item.logo}" alt="" />
		</div>
	{/if}
	{#if !item.logo}
		<div class="ui-card__section ui-card__title ui-card__text">
			<span>{item.name}</span>
		</div>
	{/if}
	{#if getPositionTitle(item.position)}
		<div class="ui-card__text ui-card__section">
			<AdditionalText>{getPositionTitle(item.position)}</AdditionalText>
		</div>
	{/if}
	<div class="ui-card__actions ui-card__section">
		{#if item.url}
			<div class="ui-card__action">
				<Button onClick="{onClick(item.url)}" disabled="{readonly}">Web</Button>
			</div>
		{/if}
		{#if item.source}
			<div class="ui-card__action">
				<Button onClick="{onClick(item.source)}" disabled="{readonly}">Source</Button>
			</div>
		{/if}
		{#if item.registry}
			<div class="ui-card__action">
				<Button onClick="{onClick(item.registry)}" disabled="{readonly}">Package</Button>
			</div>
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
		<div class="ui-card__text ui-card__section">
			<AdditionalText>{item.description}</AdditionalText>
		</div>
	{/if}
</div>

<style lang="scss">
	@import './theme';
	@import '../global';

	@mixin card-style($border, $background) {
		@include smooth-change(background-color, border-color);

		background-color: $background;
		border-color: $border;
	}

	.ui-card {
		border: $unit-eighth solid black;
		box-sizing: border-box;
		height: 100%;
		padding: $unit $unit-half;

		&.l {
			@include card-style($cl-black-light, $cl-grey-light);
		}

		&.d {
			@include card-style($cl-black-light, $cl-blue-dark);
		}

		&__logo-container {
			height: 10 * $unit-quarter;
			margin: auto;
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
		}

		&__action {
			margin: 0 $unit-quarter;
		}

		&__text {
			text-align: center;
		}

		&__section {
			margin-bottom: $unit;
		}

		&__title {
			font-size: $font-size-big;
			margin-bottom: $unit-plus;
		}
	}
</style>

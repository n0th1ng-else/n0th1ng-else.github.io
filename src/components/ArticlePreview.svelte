<script lang="ts">
	import Button from '../ui/Button.svelte';
	import Title from '../ui/Title.svelte';
	import AdditionalText from '../ui/AdditionalText.svelte';
	import type { LinkInfo } from '../../common';
	import { getRelativeDate } from '../helpers/date';
	import { getServiceTitle } from '../labels';
	import { openUrl } from '../helpers/links';

	export let article: LinkInfo | undefined;
	export let showDate = false;
	export let readonly = false;

	const date = getRelativeDate(article?.meta.date);
	const text = article?.meta.description;
	const url = article?.fullUrl ?? '';
	const host = getServiceTitle(article?.service);
	const image = article?.meta.image;

	const onClick = () => openUrl(url);
	const btnText = host ? `Read more on ${host}` : 'Read More';
</script>

<div>
	<Title centered="{false}">{article?.meta.title}</Title>
	{#if showDate}
		<div class="article-preview__date">
			<AdditionalText>{date}</AdditionalText>
		</div>
	{/if}

	<div class="article-preview">
		{#if image}
			<div class="article-preview__logo-container">
				<img class="article-preview__logo" src="{image}" alt="" />
			</div>
		{/if}
		<div class="article-preview__description">
			{text}
		</div>
		<div class="article-preview__read-more">
			<Button hint="Read more" on:click="{onClick}" disabled="{readonly}">{btnText}</Button>
		</div>
	</div>
</div>

<style lang="scss">
	@import '../global';

	.article-preview {
		display: flex;
		flex-direction: column;

		&__read-more {
			margin: $unit-double auto;
		}

		&__description {
			margin: $unit 0;
		}

		&__logo-container {
			margin: $unit auto;
			width: 100%;
		}

		&__logo {
			height: auto;
			width: 100%;
		}

		&__date {
			display: flex;
			justify-content: flex-end;
		}
	}
</style>

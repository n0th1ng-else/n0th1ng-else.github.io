<script lang="ts">
	import Button from '../ui/Button.svelte';
	import Title from '../ui/Title.svelte';
	import AdditionalText from '../ui/AdditionalText.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import Image from './Image.svelte';
	import type { LinkInfo } from '../../common';
	import { getRelativeDate } from '../helpers/date';
	import { getServiceTitle } from '../labels';
	import { openUrl } from '../helpers/links';

	export let article: LinkInfo;
	export let showDate = false;
	export let readonly = false;

	const date = getRelativeDate(article.meta.date);
	const text = article.meta.description;
	const url = article.fullUrl ?? '';
	const host = getServiceTitle(article.service);
	const image = article.meta.image;
	const preview = article.meta.imagePreview;

	const onClick = () => openUrl(url);
	const btnText = host ? `Read more on ${host}` : 'Read More';
</script>

<section>
	<Title centered="{false}">{article.meta.title}</Title>
	{#if showDate}
		<aside class="article-preview__date">
			<AdditionalText>{date}</AdditionalText>
		</aside>
	{/if}

	<div class="article-preview">
		{#if image}
			<p class="article-preview__logo-container">
				<Image alt="article logo" width="100%" height="auto" image="{image}" preview="{preview}" />
			</p>
		{/if}
		<div class="article-preview__description">
			<SubTitle inline>
				{text}
			</SubTitle>
		</div>
		<p class="article-preview__read-more">
			<Button hint="Read more" on:click="{onClick}" disabled="{readonly}">{btnText}</Button>
		</p>
	</div>
</section>

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

		&__date {
			display: flex;
			justify-content: flex-end;
		}
	}
</style>

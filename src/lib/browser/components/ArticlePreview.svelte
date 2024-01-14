<script lang="ts">
	import Button from '$lib/browser/ui/Button.svelte';
	import Title from '$lib/browser/ui/Title.svelte';
	import AdditionalText from '$lib/browser/ui/AdditionalText.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import { getLongMonthDate } from '$lib/common/date';
	import { getServiceTitle } from '$lib/common/labels';
	import { isInternalArticle } from '$lib/common/articles';
	import type { PublicationInfo } from '$lib/common/@types/common';

	export let article: PublicationInfo;
	export let showDate = false;
	export let readonly = false;
	export let addDraft = false;
	export let selfUrl = '';

	const date = getLongMonthDate(article.meta.date);
	const text = article.meta.description;
	const externalService = getServiceTitle(article);
	const internal = isInternalArticle(article);
	const image = article.meta.image;

	const getUrl = (item: PublicationInfo): string => {
		const url = internal ? `${selfUrl}${item.fullUrl}` : item.fullUrl;
		return addDraft ? `${url}?draft=true` : url;
	};

	const btnText = externalService ? `Read more on ${externalService}` : 'Read more';
</script>

<section>
	<Title centered="{false}">{article.meta.title}</Title>
	{#if showDate}
		<aside class="date">
			<AdditionalText>{date}</AdditionalText>
		</aside>
	{/if}

	<div class="container">
		{#if image}
			<p class="logo-container">
				<img class="logo" src="{image}" alt="" />
			</p>
		{/if}
		<div class="description">
			<SubTitle inline>
				{text}
			</SubTitle>
		</div>
		<p class="action">
			<Button
				hint="Read full article"
				href="{getUrl(article)}"
				disabled="{readonly}"
				external="{!internal}">{btnText}</Button
			>
		</p>
	</div>
</section>

<style lang="scss">
	@import '../../../global';

	.date {
		display: flex;
		justify-content: flex-end;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.description {
		margin-block: $unit;
		margin-inline: 0;
	}

	.action {
		margin-block: $unit-double;
		margin-inline: auto;
	}

	.logo-container {
		margin-block: $unit;
		margin-inline: auto;
		width: 100%;
	}

	.logo {
		height: auto;
		width: 100%;
	}
</style>

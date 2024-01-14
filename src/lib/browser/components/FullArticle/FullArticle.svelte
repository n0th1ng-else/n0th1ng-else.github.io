<script lang="ts">
	import 'highlight.js/scss/github-dark.scss';
	import './markdown.scss';
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme } from '$lib/browser/stores/theme';
	import { getLongMonthDate, secondsToMinutes } from '$lib/common/date';
	import Title from '$lib/browser/ui/Title.svelte';
	import AdditionalText from '$lib/browser/ui/AdditionalText.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import Tag from '$lib/browser/ui/Tag.svelte';
	import { isInternalArticle } from '$lib/common/articles';
	import type { PublicationInfo } from '$lib/common/@types/common';

	export let article: PublicationInfo;

	const date = getLongMonthDate(article.meta.date);
	const content = isInternalArticle(article) ? article.content : article.meta.description;
	const keywords = isInternalArticle(article) ? article.meta.keywords : [];
	const readingTime = isInternalArticle(article) ? article.meta.readingTime : 0;
	const readingMin = secondsToMinutes(readingTime);

	let isDark = true;

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<section>
	<Title centered="{false}">{article.meta.title}</Title>
	<aside class="meta">
		<AdditionalText>{readingMin} min read</AdditionalText>
		<AdditionalText>{date}</AdditionalText>
	</aside>

	<div class="container mkdn" class:l="{!isDark}" class:d="{isDark}">
		<SubTitle inline>
			<!-- eslint-disable svelte/no-at-html-tags -->
			{@html content}
		</SubTitle>
	</div>

	{#if keywords}
		<div class="tags">
			{#each keywords as keyword}
				<Tag title="{keyword}" />
			{/each}
		</div>
	{/if}
</section>

<style lang="scss">
	@import '../../../../global';

	.meta {
		display: flex;
		justify-content: space-between;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		margin-block-start: $unit;
	}
</style>

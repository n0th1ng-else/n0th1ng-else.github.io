<script lang="ts">
	import 'highlight.js/scss/github-dark.scss';
	import './markdown.scss';
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme } from '$lib/browser/stores/theme';
	import { getRelativeDate } from '$lib/common/date';
	import Title from '$lib/browser/ui/Title.svelte';
	import AdditionalText from '$lib/browser/ui/AdditionalText.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import type { LinkInfo } from '$lib/common/@types/common';

	export let article: LinkInfo;

	const date = getRelativeDate(article.meta.date);
	const text = article.internal ? article.content : article.meta.description;
	const readingTime = article.internal ? article.readingTime : 0;
	const readingMin = Math.ceil(readingTime / 60);

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
			{@html text}
		</SubTitle>
	</div>
</section>

<style lang="scss">
	.meta {
		display: flex;
		justify-content: space-between;
	}

	.container {
		display: flex;
		flex-direction: column;
	}
</style>

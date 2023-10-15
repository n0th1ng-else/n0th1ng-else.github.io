<script lang="ts">
	import 'highlight.js/scss/github-dark.scss';
	import { getRelativeDate } from '$lib/common/date';
	import Title from '$lib/browser/ui/Title.svelte';
	import AdditionalText from '$lib/browser/ui/AdditionalText.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import type { LinkInfo } from '$lib/common/@types/common';

	export let article: LinkInfo;

	const date = getRelativeDate(article.meta.date);
	const text = article.internal ? article.content : article.meta.description;
</script>

<section>
	<Title centered="{false}">{article.meta.title}</Title>
	<aside class="date">
		<AdditionalText>{date}</AdditionalText>
	</aside>

	<div class="container">
		<SubTitle inline>
			<!-- eslint-disable svelte/no-at-html-tags -->
			{@html text}
		</SubTitle>
	</div>
</section>

<style lang="scss">
	.date {
		display: flex;
		justify-content: flex-end;
	}

	.container {
		display: flex;
		flex-direction: column;
	}
</style>

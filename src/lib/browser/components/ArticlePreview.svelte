<script lang="ts">
	import { getRelativeDate } from '$lib/common/date';
	import Button from '$lib/browser/ui/Button.svelte';
	import Title from '$lib/browser/ui/Title.svelte';
	import AdditionalText from '$lib/browser/ui/AdditionalText.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import { getServiceTitle } from '$lib/common/labels';
	import type { LinkInfo } from '$lib/common/@types/common';

	export let article: LinkInfo;
	export let showDate = false;
	export let readonly = false;

	const date = getRelativeDate(article.meta.date);
	const text = article.meta.description;
	const url = article.fullUrl ?? '';
	const host = getServiceTitle(article.service);
	const image = article.meta.image;

	const btnText = host ? `Read more on ${host}` : 'Read More';
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
			<Button hint="Read more" href="{url}" disabled="{readonly}">{btnText}</Button>
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
		margin: $unit 0;
	}

	.action {
		margin: $unit-double auto;
	}

	.logo-container {
		margin: $unit auto;
		width: 100%;
	}

	.logo {
		height: auto;
		width: 100%;
	}
</style>
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Title from '../ui/Title.svelte';
	import AdditionalText from '../ui/AdditionalText.svelte';
	import Button from '../ui/Button.svelte';
	import { push } from 'svelte-spa-router';
	import { notFoundRoute } from '../routes';
	import { getArticles } from '../helpers/selectors';
	import { getPageTitle, getServiceTitle } from '../labels';
	import { getRelativeDate } from '../helpers/date';
	import { openUrl } from '../helpers/links';
	import { showBack, hideBack } from '../helpers/navigation';

	export let params: { id?: string } = {};

	const articles = getArticles();
	const article = articles.find(artcl => artcl.id === params.id);

	if (!article) {
		push(notFoundRoute);
	}

	const title = getPageTitle(article?.meta.title ?? '');
	const date = getRelativeDate(article?.meta.date);
	const text = article?.meta.description;
	const url = article?.fullUrl ?? '';
	const host = getServiceTitle(article?.service);
	const image = article?.meta.image;
	const isInternal = false; // TODO

	const onClick = () => openUrl(url);
	const btnText = host ? `Read more on ${host}` : 'Read More';

	onMount(() => showBack());
	onDestroy(() => hideBack());
</script>

<div>
	<Title centered="{false}">{article?.meta.title}</Title>
	<AdditionalText>{date}</AdditionalText>

	{#if !isInternal}
		<div class="external-article">
			{#if image}
				<div class="external-article__logo-container">
					<img class="external-article__logo" src="{image}" alt="" />
				</div>
			{/if}
			<div class="external-article__description">
				{text}
			</div>
			<div class="external-article__read-more">
				<Button hint="Read more" onClick="{onClick}">{btnText}</Button>
			</div>
		</div>
	{/if}
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../global';

	.external-article {
		display: flex;
		flex-direction: column;

		&__read-more {
			margin: $unit-double auto;
		}

		&__description {
			margin: $unit 0;
		}

		&__logo-container {
			height: $unit * 20;
			margin: $unit auto;
			width: 100%;
		}

		&__logo {
			height: 100%;
			object-fit: contain;
			width: 100%;
		}
	}
</style>

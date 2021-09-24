<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import ArticlePreview from '../components/ArticlePreview.svelte';
	import { push } from 'svelte-spa-router';
	import { notFoundRoute } from '../routes';
	import { getArticles } from '../helpers/selectors';
	import { getPageTitle } from '../labels';
	import { showBack, hideBack } from '../helpers/navigation';

	export let params: { slug?: string } = {};

	const articles = getArticles();
	const article = articles.find(artcl => artcl.id === params.slug);

	if (!article) {
		push(notFoundRoute);
	}

	const title = getPageTitle(article?.meta.title ?? '');

	onMount(() => showBack());
	onDestroy(() => hideBack());
</script>

<ArticlePreview article="{article}" showDate />

<svelte:head>
	<title>{title}</title>
</svelte:head>

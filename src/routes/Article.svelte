<script lang="ts">
	import Title from '../ui/Title.svelte';
	import { push } from 'svelte-spa-router';
	import { notFoundRoute } from '../routes';
	import { getArticles } from '../helpers/selectors';

	export let params: { id?: string } = {};

	const articles = getArticles();
	const article = articles.find(artcl => artcl.id === params.id);

	if (!article) {
		push(notFoundRoute);
	}
</script>

<div>
	<Title centered="{false}">{article?.meta.title}</Title>
</div>

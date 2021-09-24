<script lang="ts">
	import ArticlePreview from '../components/ArticlePreview.svelte';
	import Link from '../ui/Link.svelte';
	import { homeTitle as title } from '../labels';
	import { blogRoute } from '../routes';
	import { sortByDate } from '../helpers/date';
	import { getEngArticles } from '../helpers/articles';

	const articles = sortByDate(getEngArticles());
	const article = articles.length ? articles[0] : undefined;
</script>

<div>
	<div>
		<ArticlePreview article="{article}" />
	</div>
	<div class="blog-link">
		Find more posts in my <Link inline url="{blogRoute}">Blog</Link>.
	</div>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../global';
	.blog-link {
		margin-top: $unit;
	}
</style>

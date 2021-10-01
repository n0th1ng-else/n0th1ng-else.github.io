<script lang="ts">
	import ArticlePreview from '../components/ArticlePreview.svelte';
	import Link from '../ui/Link.svelte';
	import Meta from '../ui/Meta.svelte';
	import { homeTitle as title } from '../labels';
	import { blogRoute } from '../helpers/routes';
	import { sortByDate } from '../helpers/date';
	import { getEngArticles } from '../helpers/articles';
	import { getProfile } from '../helpers/selectors';

	const profile = getProfile();
	const photo = profile.image;

	const articles = sortByDate(getEngArticles());
	const article = articles.length ? articles[0] : undefined;
</script>

<Meta image="{photo ?? ''}" description="Latest articles, contacts and interesting observations." />
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

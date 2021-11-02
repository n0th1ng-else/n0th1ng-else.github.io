<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const host = page.host;
		const path = page.path;

		return {
			props: {
				pageUrl: `${host}${path}`
			}
		};
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import ArticlePreview from '../components/ArticlePreview.svelte';
	import Link from '../ui/Link.svelte';
	import Meta from '../ui/Meta.svelte';
	import Paragraph from '../ui/Paragraph.svelte';
	import { homeTitle as title } from '../labels';
	import { blogRoute } from '../helpers/routes';
	import { sortByDate } from '../helpers/date';
	import { getEngArticles } from '../helpers/articles';
	import { getProfile } from '../helpers/selectors';

	export let pageUrl: string;

	const photo = getProfile().image ?? '';

	const articles = sortByDate(getEngArticles());
	const article = articles.length ? articles[0] : undefined;
</script>

<Meta
	image="{photo}"
	description="Latest articles, contacts and interesting observations. All in one place. Welcome to my blog."
	url="{pageUrl}"
/>
<ArticlePreview article="{article}" readonly="{!browser}" />
<section class="blog-link">
	<Paragraph>
		Find more posts in my <Link inline url="{blogRoute}">Blog</Link>.
	</Paragraph>
</section>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../global';
	.blog-link {
		margin-top: $unit;
	}
</style>

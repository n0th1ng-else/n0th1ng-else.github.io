<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { getArticles } from '../helpers/api';
	import { Logger } from '../helpers/log';

	const logger = new Logger('home:ssr');

	export const load: Load = async ({ page }) => {
		const host = page.host;
		const path = page.path;
		const pageUrl = `${host}${path}`;

		try {
			const articles = await getArticles(host);
			return {
				props: {
					articles: articles.items,
					pageUrl
				}
			};
		} catch (err) {
			logger.error('Failed to load articles', err);
			return {
				props: {
					articles: [],
					pageUrl
				}
			};
		}
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import ArticlePreview from '../components/ArticlePreview.svelte';
	import Link from '../ui/Link.svelte';
	import Meta from '../ui/Meta.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import { homeTitle as title } from '../labels';
	import { blogRoute } from '../helpers/routes';
	import { sortByDate } from '../helpers/date';
	import { getProfile } from '../helpers/selectors';
	import type { LinkInfo } from '../../common';

	export let articles: LinkInfo[];
	export let pageUrl: string;

	const photo = getProfile().image ?? '';

	const engArticles = articles.filter(article => article.lang === 'en');
	const sortedArticles = sortByDate(engArticles);
	const article = sortedArticles.length ? sortedArticles[0] : undefined;
</script>

<Meta
	image="{photo}"
	description="Latest articles, contacts and interesting observations. All in one place. Welcome to my blog."
	url="{pageUrl}"
/>
<ArticlePreview article="{article}" readonly="{!browser}" />
<section class="blog-link">
	<SubTitle inline>
		Find more posts in my <Link inline url="{blogRoute}">Blog</Link>.
	</SubTitle>
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

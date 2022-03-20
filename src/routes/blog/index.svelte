<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { getArticles } from '../../helpers/api';
	import { Logger } from '../../helpers/log';

	const logger = new Logger('articles:ssr');

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
			logger.error('Failed to load an articles', err);
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
	import Title from '../../ui/Title.svelte';
	import SubTitle from '../../ui/SubTitle.svelte';
	import Link from '../../ui/Link.svelte';
	import List from '../../ui/List.svelte';
	import Meta from '../../ui/Meta.svelte';
	import Paragraph from '../../ui/Paragraph.svelte';
	import { toArticle } from '../../helpers/routes';
	import { blogTitle as title } from '../../labels';
	import { getProfile } from '../../helpers/selectors';
	import { groupByYear, getRelativeDate, sortByDate } from '../../helpers/date';
	import { sortAsNumber } from '../../helpers/sort';
	import type { LinkInfo } from '../../../common';

	export let articles: LinkInfo[];
	export let pageUrl: string;

	const photo = getProfile().image ?? '';

	const groups = groupByYear(articles);
	const years = sortAsNumber(Object.keys(groups));

	const getGroup = (year: string): LinkInfo[] => sortByDate(groups[year]);
</script>

<Meta
	image="{photo}"
	description="List of my publications through the years. Most of them are written in English."
	url="{pageUrl}"
/>
<article>
	<Title>Tracking the posts written by me</Title>
	<div>
		{#each years as year}
			<section>
				<SubTitle id="in-{year}">{year}</SubTitle>
				<List>
					{#each getGroup(year) as item}
						<li>
							<div class="article">
								<div class="article__title">
									<Paragraph>
										<Link inline url="{toArticle(item.id)}">
											{item.meta.title}
										</Link>
									</Paragraph>
								</div>
								<aside class="article__date">
									{getRelativeDate(item.meta.date)}
								</aside>
							</div>
						</li>
					{/each}
				</List>
			</section>
		{/each}
	</div>
</article>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../../ui/theme';
	@import '../../global';

	.article {
		display: flex;
		align-items: center;
		margin-bottom: $unit;

		&__title {
			flex: 1;
		}

		&__date {
			display: none;
			font-weight: $font-weight-light;

			@media (min-width: $md) {
				display: block;
			}
		}
	}
</style>

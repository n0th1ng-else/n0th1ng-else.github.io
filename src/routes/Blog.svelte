<script lang="ts">
	import Title from '../ui/Title.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import Link from '../ui/Link.svelte';
	import { RoutePath, toArticle } from '.';
	import { getPageTitle } from '../labels';
	import { getArticles } from '../helpers/selectors';
	import { groupByYear, getRelativeDate } from '../helpers/date';
	import { sortAsNumber } from '../helpers/sort';
	import type { LinkInfo } from '../../common';

	const groups = groupByYear(getArticles());
	const years = sortAsNumber(Object.keys(groups));

	const getGroup = (year: string): LinkInfo[] => groups[year];
</script>

<div>
	<Title>Tracking the posts written by me</Title>
	<div>
		{#each years as year}
			<div>
				<SubTitle>{year}</SubTitle>
				<ul>
					{#each getGroup(year) as item}
						<li>
							<div class="article">
								<div class="article-title">
									<Link url="{toArticle(item.id)}">
										{item.meta.title}
									</Link>
								</div>
								<div>
									{getRelativeDate(item.meta.date)}
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>

<svelte:head>
	<title>{getPageTitle(RoutePath.Blog)}</title>
</svelte:head>

<style lang="scss">
	@import '../global';

	.article {
		display: flex;
		align-items: center;
		margin-bottom: $unit;
	}

	.article-title {
		flex: 1;
	}
</style>

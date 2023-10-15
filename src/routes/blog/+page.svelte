<script lang="ts">
	import { profileStore } from '$lib/browser/stores';
	import { toArticle } from '$lib/common/routes';
	import { groupByYear, getRelativeDate, sortByDate } from '$lib/common/date';
	import Title from '$lib/browser/ui/Title.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import Link from '$lib/browser/ui/Link.svelte';
	import List from '$lib/browser/ui/List.svelte';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import Paragraph from '$lib/browser/ui/Paragraph.svelte';
	import { sortAsNumber } from '$lib/common/sort';
	import { blogTitle as title } from '$lib/common/labels';
	import type { LinkInfo } from '$lib/common/@types/common';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url, articles } = data;

	const groups = groupByYear(articles);
	const years = sortAsNumber(Object.keys(groups));
	const getGroup = (year: string): LinkInfo[] => {
		// @ts-expect-error the year is actually a property of groups (Object.keys(groups))
		return sortByDate(groups[year]);
	};
</script>

<Meta
	image="{$profileStore?.image ?? ''}"
	description="List of my publications through the years. Most of them are written in English."
	{url}
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
	@import '../../lib/browser/ui/theme';
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
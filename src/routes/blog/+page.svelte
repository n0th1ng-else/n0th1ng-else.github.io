<script lang="ts">
	import { profileStore } from '$lib/browser/stores';
	import { toArticle } from '$lib/common/routes';
	import { groupByYear, getShortMonthDate, sortByDate } from '$lib/common/date';
	import Title from '$lib/browser/ui/Title.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import Link from '$lib/browser/ui/Link.svelte';
	import List from '$lib/browser/ui/List.svelte';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import Paragraph from '$lib/browser/ui/Paragraph.svelte';
	import AdditionalText from '$lib/browser/ui/AdditionalText.svelte';
	import { sortAsNumber } from '$lib/common/sort';
	import { blogTitle as title } from '$lib/common/labels';
	import type { PublicationInfo } from '$lib/common/@types/common';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url, articles, showDraft } = data;

	const groups = groupByYear(articles);
	const years = sortAsNumber(Object.keys(groups));
	const getGroup = (year: string): PublicationInfo[] => {
		return sortByDate(groups[year]);
	};

	const getUrl = (item: PublicationInfo): string => {
		const url = toArticle(item.id);
		const addQuery = showDraft && item.draft;
		return addQuery ? `${url}?draft=true` : url;
	};

	const getTitle = (item: PublicationInfo): string => {
		const title = item.meta.title ?? '';
		return item.draft ? `[⭐⭐DRAFT⭐⭐] ${title}` : title;
	};
</script>

<Meta
	image="{$profileStore?.image ?? ''}"
	title="Published in the blog"
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
										<Link inline url="{getUrl(item)}">
											{getTitle(item)}
										</Link>
									</Paragraph>
								</div>
								<aside class="article__date">
									<AdditionalText>{getShortMonthDate(item.meta.date)}</AdditionalText>
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
		margin-block-end: $unit;

		&__title {
			flex: 1;
		}

		&__date {
			display: none;

			@media (min-width: $md) {
				display: block;
			}
		}
	}
</style>

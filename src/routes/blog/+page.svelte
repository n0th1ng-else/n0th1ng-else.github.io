<script lang="ts">
	import Title from '$lib/browser/ui/Title.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import Link from '$lib/browser/ui/Link.svelte';
	import List from '$lib/browser/ui/List.svelte';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import Paragraph from '$lib/browser/ui/Paragraph.svelte';
	import { toArticle } from '$lib/common/routes';
	import { groupByYear, getRelativeDate, sortArticlesByDate } from '$lib/common/date';
	import { sortAsNumber } from '$lib/common/sort';
	import { blogTitle as title } from '$lib/common/labels';
	import { getProfile } from '$lib/browser/stores/profile.svelte';
	import type { PublicationInfo } from '$lib/types';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const { url, articles } = data;

	const profile = $derived.by(() => getProfile());
	const profileImage = $derived(profile?.image ?? '');

	const groups = groupByYear(articles);
	const years = sortAsNumber(Object.keys(groups));
	const getGroup = (year: string): PublicationInfo[] => {
		return sortArticlesByDate(groups[year]);
	};

	const getUrl = (item: PublicationInfo): string => toArticle(item.id);

	const getTitle = (item: PublicationInfo): string => item.meta.title ?? '';
</script>

<Meta
	image={profileImage}
	title="Published in the blog"
	description="List of my publications through the years. Most of them are written in English."
	{url}
/>
<article>
	<Title>Tracking the posts written by me</Title>
	<div>
		{#each years as year (year)}
			<section>
				<SubTitle id="in-{year}">{year}</SubTitle>
				<List>
					{#each getGroup(year) as item (item.id)}
						<li>
							<div class="article">
								<div class="article__title">
									<Paragraph flat>
										<Link inline url={getUrl(item)}>
											{getTitle(item)}
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
	@use '../../lib/browser/ui/theme' as t;
	@use '../../global' as g;

	.article {
		display: flex;
		align-items: center;
		padding-block-end: g.$unit;

		&__title {
			flex: 1;
		}

		&__date {
			display: none;
			font-weight: g.$font-weight-light;

			@media (min-width: t.$md) {
				display: block;
			}
		}
	}
</style>

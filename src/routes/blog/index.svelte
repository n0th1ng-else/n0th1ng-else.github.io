<script lang="ts">
	import Title from '../../ui/Title.svelte';
	import SubTitle from '../../ui/SubTitle.svelte';
	import Link from '../../ui/Link.svelte';
	import List from '../../ui/List.svelte';
	import Meta from '../../ui/Meta.svelte';
	import { toArticle } from '../../helpers/routes';
	import { blogTitle as title } from '../../labels';
	import { getArticles, getProfile } from '../../helpers/selectors';
	import { groupByYear, getRelativeDate, sortByDate } from '../../helpers/date';
	import { sortAsNumber } from '../../helpers/sort';
	import type { LinkInfo } from '../../../common';

	const profile = getProfile();
	const photo = profile.image;

	const groups = groupByYear(getArticles());
	const years = sortAsNumber(Object.keys(groups));

	const getGroup = (year: string): LinkInfo[] => sortByDate(groups[year]);
</script>

<Meta image="{photo ?? ''}" description="List of my publications through the years" />
<div>
	<Title>Tracking the posts written by me</Title>
	<div>
		{#each years as year}
			<div>
				<SubTitle>{year}</SubTitle>
				<List>
					{#each getGroup(year) as item}
						<li>
							<div class="article">
								<div class="article__title">
									<Link inline url="{toArticle(item.id)}">
										{item.meta.title}
									</Link>
								</div>
								<div class="article__date">
									{getRelativeDate(item.meta.date)}
								</div>
							</div>
						</li>
					{/each}
				</List>
			</div>
		{/each}
	</div>
</div>

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

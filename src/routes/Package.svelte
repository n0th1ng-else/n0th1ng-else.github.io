<script lang="ts">
	import type { LinkInfo } from '../../common';
	import LinkItem from '../components/LinkItem.svelte';
	import { RoutePath } from '.';
	import { getPageTitle } from '../labels';
	import { getSortedList } from '../helpers/sort';
	import { getPackages } from '../helpers/global';

	const packages: LinkInfo[] = getSortedList(getPackages());
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Package)}</title>
</svelte:head>

<div>
	{#each packages as pack (pack.fullUrl)}
		<LinkItem publication="{pack}" />
	{/each}
</div>

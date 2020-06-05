<script>
	import LinkItem from '../components/LinkItem.svelte';
	import { getPageTitle } from '../labels'
	import { RoutePath } from '.';
	import { getSortedList } from '../helpers/sort';

	const packages = getSortedList(runtime.meta.packages);
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Package)}</title>
</svelte:head>

<div>
	{#each packages as pack (pack.fullUrl)}
		<LinkItem publication="{pack}" />
	{/each}
</div>

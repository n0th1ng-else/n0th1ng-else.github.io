<style>
	.flex-right {
		margin: 0 10px;
		justify-content: flex-end;
	}
</style>

<script>
	import Switch from '@smui/switch';
	import FormField from '@smui/form-field';
	import LinkItem from '../components/LinkItem.svelte';
	import { getSortedList } from '../helpers/sort';
	import { getPageTitle } from '../labels';
	import { RoutePath } from '.';

	let selected = false;

	const allPublications = getSortedList(runtime.meta.publications);
	const enPubs = getSortedList(runtime.meta.publications.filter(pub => pub.lang === 'en'));

	function getPublications(isSelected) {
		return isSelected ? [...allPublications] : [...enPubs];
	}

	let pubsToRender = getPublications(selected);

	function updateList() {
		pubsToRender = getPublications(selected);
	}
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Publication)}</title>
</svelte:head>

<div>
	<div class="flex-container flex-right">
		<div>
			<FormField align="end">
				<Switch bind:checked="{selected}" on:change="{updateList}" />
				<span slot="label">Show publications in Russian</span>
			</FormField>
		</div>
	</div>
	<div>
		{#each pubsToRender as pub (pub.fullUrl)}
			<LinkItem publication="{pub}" />
		{/each}
	</div>
</div>

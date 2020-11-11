<style lang="scss">
	@import '../global';

	.flex-right {
		justify-content: flex-end;
	}

	.padded-switch {
		margin: $unit $unit-half;
	}

	.linked-with-field {
		cursor: pointer;
	}
</style>

<script lang="ts">
	import type { LinkInfo } from '../../common';
	import Switch from '@smui/switch';
	import FormField from '@smui/form-field';
	import LinkItem from '../components/LinkItem.svelte';
	import { RoutePath } from '.';
	import { getSortedList } from '../helpers/sort';
	import { getPageTitle } from '../labels';
	import { getArticles } from '../helpers/global';
	import { Language } from '../data/language';

	let selected = false;

	const publications: LinkInfo[] = getArticles();
	const allPublications: LinkInfo[] = getSortedList(publications);
	const enPubs: LinkInfo[] = getSortedList(publications.filter(pub => pub.lang === Language.En));

	const getPublications = (isSelected: boolean): LinkInfo[] =>
		isSelected ? [...allPublications] : [...enPubs];

	let pubsToRender = getPublications(selected);

	const updateList = () => {
		pubsToRender = getPublications(selected);
	};
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Articles)}</title>
</svelte:head>

<div>
	<div class="flex-container flex-right">
		<div class="padded-switch">
			<FormField align="end">
				<Switch bind:checked="{selected}" on:change="{updateList}" />
				<span slot="label" class="linked-with-field">Show publications in Russian</span>
			</FormField>
		</div>
	</div>
	<div>
		{#each pubsToRender as pub (pub.fullUrl)}
			<LinkItem publication="{pub}" />
		{/each}
	</div>
</div>

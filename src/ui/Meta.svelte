<script lang="ts">
	import type { MetaType, TwitterType } from '../helpers/meta';
	import { getPageTitle } from '../labels';

	export let type: MetaType; // Facebook type
	export let twitterType: TwitterType; // Twitter type
	export let title: string; // Page title like head:title
	export let image: string; // Page image

	export let description = ''; // Page description (can be empty)
	export let imageAlt = ''; // Image alt text

	const siteName = getPageTitle('Webdev Blog'); // Common website name
	const url = window.location.href; // Ful page url
</script>

<svelte:head>
	<meta property="og:type" content="{type}" />
	<meta property="og:title" content="{title}" />

	<meta property="og:image" content="{image}" />
	<meta property="og:url" content="{url}" />
	<meta property="og:site_name" content="{siteName}" />

	{#if description}
		<meta property="og:description" content="{description}" />
		<meta name="twitter:description" content="{description}" />
	{/if}

	<meta name="twitter:card" content="{twitterType}" />
	<meta name="twitter:title" content="{title}" />
	<meta name="twitter:image" content="{image}" />
	<meta name="twitter:url" content="{url}" />

	{#if imageAlt}
		<meta name="twitter:image:alt" content="{imageAlt}" />
	{/if}
</svelte:head>

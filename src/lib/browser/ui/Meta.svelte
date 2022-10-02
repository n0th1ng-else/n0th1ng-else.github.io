<script lang="ts">
	import { getUrlPrefix } from '$lib/common/api';
	import { getPageTitle } from '$lib/common/labels';
	import type { MetaType, TwitterType } from '$lib/browser/utils/meta';

	export let type: MetaType = 'website'; // Facebook type
	export let twitterType: TwitterType = 'summary'; // Twitter type

	export let title = 'Sergey Nikitin'; // Page title like head:title
	export let image: string; // Page image
	export let url: string; // Ful page url

	export let description = ''; // Page description (can be empty)
	export let imageAlt = ''; // Image alt text

	const siteName = getPageTitle('Webdev Blog'); // Common website name
	const fullUrl = getUrlPrefix(url);
</script>

<svelte:head>
	<meta property="og:type" content="{type}" />
	<meta property="og:title" content="{title}" />

	<meta property="og:image" content="{image}" />
	<meta property="og:url" content="{fullUrl}" />
	<meta property="og:site_name" content="{siteName}" />

	{#if description}
		<meta property="og:description" content="{description}" />
		<meta name="twitter:description" content="{description}" />
		<meta name="description" content="{description}" />
	{/if}

	<meta name="twitter:card" content="{twitterType}" />
	<meta name="twitter:title" content="{title}" />
	<meta name="twitter:text:title" content="{title}" />
	<meta name="twitter:image" content="{image}" />
	<meta name="twitter:url" content="{fullUrl}" />

	{#if imageAlt}
		<meta name="twitter:image:alt" content="{imageAlt}" />
	{/if}
</svelte:head>

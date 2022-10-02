<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { sendPageView } from '$lib/browser/utils/analytics';

	const unsubscribeActivePath = page.subscribe(({ url }) => {
		sendPageView(`${url.host}${url.pathname}`);
	});

	onDestroy(() => {
		unsubscribeActivePath();
	});
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-C8R0LWNYTJ"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-C8R0LWNYTJ');
	</script>
</svelte:head>

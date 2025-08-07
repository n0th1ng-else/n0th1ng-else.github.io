<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { sendPageView } from '$lib/browser/utils/analytics';

	const destroy = $effect.root(() => {
		$effect(() => {
			sendPageView(`${page.url.host}${page.url.pathname}`);
		});
	});

	onDestroy(() => {
		destroy();
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

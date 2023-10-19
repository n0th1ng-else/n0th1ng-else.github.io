<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { putNewArticleHandlerIntoWindow } from '$lib/browser/utils/window';
	import { newArticleRoute } from '$lib/common/routes';
	import MetaColor from '$lib/browser/ui/MetaColor.svelte';
	import Container from '$lib/browser/ui/Container.svelte';
	import Header from '$lib/browser/components/Header.svelte';
	import Footer from '$lib/browser/components/Footer.svelte';
	import ScrollTop from '$lib/browser/components/ScrollTop.svelte';
	import Analytics from '$lib/browser/components/Analytics.svelte';
	import { versionStore, accountsStore, profileStore, themeStore } from '$lib/browser/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	const { accounts, profile, version, theme } = data;
	versionStore.update(() => version ?? null);
	accountsStore.update(() => accounts ?? null);
	profileStore.update(() => profile ?? null);
	themeStore.update(() => theme);

	let activePath = '';

	const unsubscribeActivePath = page.subscribe(({ url }) => {
		activePath = url.pathname;
	});

	if (browser) {
		putNewArticleHandlerIntoWindow(() => {
			goto(newArticleRoute);
		});
	}

	onDestroy(() => {
		unsubscribeActivePath();
	});
</script>

<MetaColor />
<Container full>
	<Header {activePath} />
	<main>
		<Container>
			<div class="content__wrapper">
				<div class="content">
					<slot />
				</div>
			</div>
		</Container>
	</main>
	<Footer showFCP="{browser}" />
	{#if browser}
		<ScrollTop />
		<Analytics />
	{/if}
</Container>

<style lang="scss">
	@import '../global';

	.content__wrapper {
		margin: 0 auto;
		max-width: $max-content-width;
	}

	.content {
		padding: 0 $unit-half;
	}
</style>

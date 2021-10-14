<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page: { path: activePath } }) => {
		return {
			props: {
				activePath
			}
		};
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { page } from '$app/stores';

	import MetaColor from '../ui/MetaColor.svelte';
	import Container from '../ui/Container.svelte';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import ScrollTop from '../components/ScrollTop.svelte';
	import Analytics from '../components/Analytics.svelte';
	import { newArticleRoute } from '../helpers/routes';
	import { putNewArticleHandlerIntoWindow } from '../helpers/window';
	import { recoverTheme } from '../helpers/theme';

	export let activePath = '';

	const unsubscribeActivePath = page.subscribe(({ path }) => {
		activePath = path;
	});

	if (browser) {
		recoverTheme();

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
	<Header syncTheme="{browser}" activePath="{activePath}" />
	<Container>
		<div class="content__wrapper">
			<div class="content">
				<slot />
			</div>
		</div>
	</Container>
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
		padding: 0 $unit;
	}
</style>

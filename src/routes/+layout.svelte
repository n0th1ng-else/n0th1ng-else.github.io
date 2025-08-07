<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { putNewArticleHandlerIntoWindow } from '$lib/browser/utils/window';
	import { newArticleRoute } from '$lib/common/routes';
	import MetaColor from '$lib/browser/ui/MetaColor.svelte';
	import Container from '$lib/browser/ui/Container.svelte';
	import Header from '$lib/browser/components/Header.svelte';
	import Footer from '$lib/browser/components/Footer.svelte';
	import ScrollTop from '$lib/browser/components/ScrollTop.svelte';
	import Analytics from '$lib/browser/components/Analytics.svelte';
	import { setProfile } from '$lib/browser/stores/profile.svelte';
	import { setTheme } from '$lib/browser/stores/theme.svelte';
	import { setVersion } from '$lib/browser/stores/version.svelte';
	import { setAccounts } from '$lib/browser/stores/accounts.svelte';
	import type { PageData } from './$types';

	const { data, children }: { data: PageData; children: Snippet } = $props();
	const { accounts, profile, version, theme } = data;

	setTheme(theme);
	setVersion(version);
	setAccounts(accounts);
	setProfile(profile);

	let activePath = $derived(page.url.pathname);

	if (browser) {
		putNewArticleHandlerIntoWindow(() => {
			goto(newArticleRoute).catch((err: unknown) => {
				// eslint-disable-next-line no-console
				console.error('Unable to open the route', err);
			});
		});
	}
</script>

<MetaColor />
<Container full>
	<Header {activePath} />
	<main>
		<Container>
			<div class="content__wrapper">
				<div class="content">
					{@render children()}
				</div>
			</div>
		</Container>
	</main>
	<Footer showFCP={browser} />
	{#if browser}
		<ScrollTop />
		<Analytics />
	{/if}
</Container>

<style lang="scss">
	@use '../global' as g;

	.content__wrapper {
		margin-block: 0;
		margin-inline: auto;
		max-width: g.$max-content-width;
	}

	.content {
		padding-block: 0;
		padding-inline: g.$unit-half;
	}
</style>

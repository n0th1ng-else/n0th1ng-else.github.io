<script lang="ts">
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';
	import Link from '$lib/browser/ui/Link.svelte';
	import { getSocialNetworks } from '$lib/browser/utils/contacts';
	import { rssRoute } from '$lib/common/routes';
	import type { ProfileAccounts } from '$lib/types';
	import icoRss from '../../../assets/icons/rss.svg';

	let { accounts }: { accounts: ProfileAccounts | null } = $props();

	const networks = $derived(accounts ? getSocialNetworks(accounts) : []);

	let isDark = $derived.by(() => isDarkTheme());
</script>

<div class="social-networks-wrapper">
	{#each networks as network (network.title)}
		<p class="social-networks-item">
			<Link external url={network.link}>
				<img
					src={network.image}
					alt="{network.title} profile link"
					class="logo no-print"
					class:l={!isDark}
					class:d={isDark}
				/>
			</Link>
		</p>
	{/each}
	<p class="social-networks-item">
		<Link url={rssRoute}>
			<img src={icoRss} alt="RSS feed" class="logo no-print" class:l={!isDark} class:d={isDark} />
		</Link>
	</p>
</div>

<style lang="scss">
	@use '../ui/theme' as t;
	@use '../../../global' as g;

	.social-networks-wrapper {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.social-networks-item {
		padding: g.$unit-half;
	}

	.logo {
		@include t.smooth-change(filter, transform);
		@include t.image-container(g.$unit-plus);

		&.l {
			@include t.draw-image-black();
		}

		&.d {
			@include t.draw-image-white();
		}
	}

	@media (min-width: t.$sm) {
		.logo {
			@include t.image-container(g.$unit-double);
		}
	}

	@media (min-width: t.$md) {
		.logo {
			@include t.image-container(g.$unit-triple);
		}
	}

	@media print {
		.no-print {
			display: none;
		}
	}
</style>

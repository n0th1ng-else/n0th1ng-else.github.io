<script lang="ts">
	import { goto } from '$app/navigation';
	import { homeRoute, blogRoute } from '$lib/common/routes';
	import { toggleTheme, isDarkTheme, getTheme } from '$lib/browser/stores/theme.svelte';
	import { getBackButtonState } from '$lib/browser/stores/navigation.svelte';
	import { persistTheme } from '$lib/common/theme';
	import Button from '$lib/browser/ui/Button.svelte';
	import HeaderLink from '$lib/browser/ui/HeaderLink.svelte';
	import Paragraph from '$lib/browser/ui/Paragraph.svelte';
	import HeaderNavigation from '$lib/browser/components/HeaderNavigation.svelte';

	import Arrow from './Arrow.svelte';
	import icoSun from '../../../assets/icons/sun.svg';
	import icoMoon from '../../../assets/icons/moon.svg';

	let showBack = $derived.by(() => getBackButtonState());
	let isDark = $derived.by(() => isDarkTheme());
	let icon = $derived(isDark ? icoSun : icoMoon);

	const switchTheme = () => {
		toggleTheme();
		persistTheme(getTheme());
	};

	const onBack = () => goto(blogRoute);

	let {
		activePath = '',
		hasReadingList = false
	}: { activePath?: string; hasReadingList?: boolean } = $props();
</script>

<header class="header-wrapper">
	<nav class="header">
		<div class="navigation-wrapper">
			<div class="back-button" class:open={showBack}>
				<Paragraph flat>
					<Arrow type="left" size="md" onClick={onBack} hint="Go back to the articles list" />
				</Paragraph>
			</div>
			<p class="logo-container">
				<HeaderLink url={homeRoute} active={homeRoute === activePath} label="Go to the home page">
					<span class="brand">Nothing Else.</span>
				</HeaderLink>
			</p>
			<div class="navigation-inline">
				<HeaderNavigation {activePath} {hasReadingList} />
			</div>
			<p class="theme">
				<Button secondary onClick={switchTheme} printVisible={false} {icon} hint="change theme" />
			</p>
		</div>
		<div class="navigation">
			<HeaderNavigation {activePath} {hasReadingList} />
		</div>
	</nav>
</header>

<style lang="scss">
	@use '../ui/theme' as t;
	@use '../../../global' as g;

	@keyframes slideInAccordion {
		0% {
			opacity: 0;
			max-width: 0;
			display: none;
		}

		1% {
			opacity: 0;
			max-width: 0;
			display: inline-block;
		}

		99% {
			opacity: 1;
			max-width: g.$unit-triple;
			display: inline-block;
		}

		100% {
			opacity: 1;
			max-width: g.$unit-triple;
			display: inline-block;
		}
	}

	@keyframes slideOutAccordion {
		0% {
			opacity: 1;
			max-width: g.$unit-triple;
			display: inline-block;
		}

		1% {
			opacity: 1;
			max-width: g.$unit-triple;
			display: inline-block;
		}

		99% {
			opacity: 0;
			max-width: 0;
			display: inline-block;
		}

		100% {
			opacity: 0;
			max-width: 0;
			display: none;
		}
	}

	.back-button {
		animation-name: slideOutAccordion;
		animation-duration: t.$transition-fast;

		opacity: 0;
		max-width: 0;
		display: none;

		&.open {
			animation-name: slideInAccordion;
			animation-duration: t.$transition-fast;

			opacity: 1;
			max-width: g.$unit-triple;
			display: inline-block;
		}
	}

	.header {
		padding-block-end: g.$unit-triple;
		padding-inline: g.$unit;
	}

	.navigation-wrapper {
		align-items: center;
		flex: 0 1 g.$max-content-width;
		display: flex;
	}

	.logo-container {
		flex: 1 0 auto;
	}

	.brand {
		font-weight: g.$font-weight-bold;
		font-size: g.$font-size-big;
	}

	.navigation-inline {
		display: none;
	}

	@media (min-width: t.$md) {
		.brand {
			font-size: g.$font-size-big;
		}

		.navigation {
			display: none;
		}

		.navigation-inline {
			display: block;
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>

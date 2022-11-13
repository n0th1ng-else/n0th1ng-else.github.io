<script type="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { homeRoute, blogRoute, projectsRoute, aboutRoute } from '$lib/common/routes';
	import {
		onThemeChange,
		toggleTheme,
		isDarkTheme,
		defaultTheme,
		persistTheme,
		Theme
	} from '$lib/browser/stores/theme';
	import { showBackStore } from '$lib/browser/stores/navigation';
	import Button from '$lib/browser/ui/Button.svelte';
	import HeaderLink from '$lib/browser/ui/HeaderLink.svelte';
	import List from '$lib/browser/ui/List.svelte';

	import Arrow from './Arrow.svelte';
	import icoSun from '../../../assets/icons/sun.svg';
	import icoMoon from '../../../assets/icons/moon.svg';

	export let syncTheme: boolean;

	const toggleThemeIcon = (th: Theme): string => (isDarkTheme(th) ? icoSun : icoMoon);

	let theme = defaultTheme;
	let icon = toggleThemeIcon(theme);
	let showBack = false;

	const unsubscribeTheme = onThemeChange(th => {
		theme = th;
		icon = toggleThemeIcon(theme);
	});
	const unsubscribePersistTheme = onThemeChange(th => {
		if (!syncTheme) {
			return;
		}
		persistTheme(th);
	});
	const unsubscribeShowBack = showBackStore.subscribe(sh => (showBack = sh));

	const switchTheme = () => {
		toggleTheme(theme);
		icon = toggleThemeIcon(theme);
	};

	const onBack = () => goto(blogRoute);

	export let activePath = '';

	onDestroy(() => {
		unsubscribeTheme();
		unsubscribePersistTheme();
		unsubscribeShowBack();
	});
</script>

<header class="header-wrapper">
	<nav class="header">
		<div class="navigation-wrapper">
			<p class="back-container" class:show="{showBack}">
				<Arrow type="left" size="sm" on:click="{onBack}" />
			</p>
			<p class="logo-container">
				<HeaderLink url="{homeRoute}" active="{homeRoute === activePath}">
					<span class="brand">Nothing Else.</span>
				</HeaderLink>
			</p>
			<div class="navigation">
				<List type="header">
					<li class="nav__item--big">
						<HeaderLink url="{blogRoute}" active="{blogRoute === activePath}">
							<span class="nav__item">Blog.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--big">
						<HeaderLink url="{projectsRoute}" active="{projectsRoute === activePath}">
							<span class="nav__item">Projects.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--big">
						<HeaderLink url="{aboutRoute}" active="{aboutRoute === activePath}">
							<span class="nav__item">It's me.</span>
						</HeaderLink>
					</li>

					<li class="nav__item--small">
						<HeaderLink url="{blogRoute}" active="{blogRoute === activePath}">
							<span class="nav__item">Blg.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--small">
						<HeaderLink url="{projectsRoute}" active="{projectsRoute === activePath}">
							<span class="nav__item">Prjcts.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--small">
						<HeaderLink url="{aboutRoute}" active="{aboutRoute === activePath}">
							<span class="nav__item">Me.</span>
						</HeaderLink>
					</li>
				</List>
			</div>
			<p class="theme">
				<Button secondary on:click="{switchTheme}" icon="{icon}" hint="change theme" />
			</p>
		</div>
	</nav>
</header>

<style lang="scss">
	@import '../ui/theme';
	@import '../../../global';

	.header {
		align-items: center;
		display: flex;
		height: $unit-triple;
		justify-content: center;
		padding-bottom: $unit-triple;
	}

	.navigation-wrapper {
		align-items: center;
		flex: 0 1 $max-content-width;
		display: flex;
	}

	.back-container {
		display: none;
		&.show {
			@media (min-width: $sm) {
				display: block;
			}
		}
	}

	.nav__item {
		&--big {
			font-size: $font-size-plus;
			display: none;
		}
		&--small {
			display: block;
		}
	}

	.logo-container {
		flex: 1 0 auto;
	}

	.brand {
		font-weight: $font-weight-bold;
	}

	@media (min-width: $sm) {
		.brand {
			font-size: $font-size-big;
		}

		.nav__item {
			&--big {
				display: block;
			}
			&--small {
				display: none;
			}
		}
	}
</style>

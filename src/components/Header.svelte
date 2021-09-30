<script type="ts">
	import { onDestroy } from 'svelte';
	import { push } from 'svelte-spa-router';
	import {
		onThemeChange,
		toggleTheme,
		isDarkTheme,
		defaultTheme,
		persistTheme,
		Theme
	} from '../helpers/theme';
	import { onShowBackChange } from '../helpers/navigation';
	import Button from '../ui/Button.svelte';
	import HeaderLink from '../ui/HeaderLink.svelte';
	import List from '../ui/List.svelte';
	import Arrow from './Arrow.svelte';
	import icoSun from '../assets/icons/sun.svg';
	import icoMoon from '../assets/icons/moon.svg';
	import { homeRoute, blogRoute, projectsRoute, aboutRoute, RoutePath } from '../routes';

	const toggleThemeIcon = (th: Theme): string => (isDarkTheme(th) ? icoSun : icoMoon);

	let theme = defaultTheme;
	let icon = toggleThemeIcon(theme);
	let showBack = false;

	const unsubscribeTheme = onThemeChange(th => {
		theme = th;
		icon = toggleThemeIcon(theme);
	});
	const unsubscribePersistTheme = onThemeChange(th => persistTheme(th));
	const unsubscribeShowBack = onShowBackChange(sh => (showBack = sh));

	const switchTheme = () => {
		toggleTheme(theme);
		icon = toggleThemeIcon(theme);
	};

	const onBack = () => push(blogRoute);

	export let activePath = '';

	onDestroy(() => {
		unsubscribeTheme();
		unsubscribePersistTheme();
		unsubscribeShowBack();
	});
</script>

<header class="header-wrapper">
	<nav role="navigation" class="header">
		<div class="navigation-wrapper">
			<div class="back-container" class:show="{showBack}">
				<Arrow type="left" size="sm" onClick="{onBack}" />
			</div>
			<div class="logo-container">
				<HeaderLink url="{homeRoute}" active="{RoutePath.Home === activePath}">
					<span class="brand">Nothing Else.</span>
				</HeaderLink>
			</div>
			<div class="navigation">
				<List type="header">
					<li class="nav__item--big">
						<HeaderLink url="{blogRoute}" active="{RoutePath.Blog === activePath}">
							<span class="nav__item">Blog.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--big">
						<HeaderLink url="{projectsRoute}" active="{RoutePath.Projects === activePath}">
							<span class="nav__item">Projects.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--big">
						<HeaderLink url="{aboutRoute}" active="{RoutePath.About === activePath}">
							<span class="nav__item">It's me.</span>
						</HeaderLink>
					</li>

					<li class="nav__item--small">
						<HeaderLink url="{blogRoute}" active="{RoutePath.Blog === activePath}">
							<span class="nav__item">Blg.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--small">
						<HeaderLink url="{projectsRoute}" active="{RoutePath.Projects === activePath}">
							<span class="nav__item">Prjcts.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--small">
						<HeaderLink url="{aboutRoute}" active="{RoutePath.About === activePath}">
							<span class="nav__item">Me.</span>
						</HeaderLink>
					</li>
				</List>
			</div>
			<div class="theme">
				<Button secondary onClick="{switchTheme}" icon="{icon}" hint="change theme" />
			</div>
		</div>
	</nav>
</header>

<style lang="scss">
	@import '../global';
	@import '../ui/theme';

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

<script type="ts">
	import { onDestroy } from 'svelte';
	import { push } from 'svelte-spa-router';
	import { onThemeChange, toggleTheme, isDarkTheme, defaultTheme } from '../helpers/theme';
	import { onShowBackChange } from '../helpers/navigation';
	import Button from '../ui/Button.svelte';
	import HeaderLink from '../ui/HeaderLink.svelte';
	import Arrow from './Arrow.svelte';
	import icoSun from '../assets/icons/sun.svg';
	import icoMoon from '../assets/icons/moon.svg';
	import { homeRoute, blogRoute, projectsRoute, aboutRoute } from '../routes';

	let theme = defaultTheme;
	let showBack = false;
	let icon = isDarkTheme(defaultTheme) ? icoSun : icoMoon;

	const unsubscribeTheme = onThemeChange(th => (theme = th));
	const unsubscribeShowBack = onShowBackChange(sh => (showBack = sh));

	const switchTheme = () => {
		toggleTheme(theme);
		icon = isDarkTheme(theme) ? icoSun : icoMoon;
	};

	onDestroy(() => {
		unsubscribeTheme();
		unsubscribeShowBack();
	});

	const onBack = () => push(blogRoute);
</script>

<header class="header-wrapper">
	<nav role="navigation" class="header">
		<div class="navigation-wrapper">
			<div class="back-container" class:show="{showBack}">
				<Arrow type="left" size="sm" onClick="{onBack}" />
			</div>
			<div class="logo-container">
				<HeaderLink url="{homeRoute}">
					<span class="brand">Nothing Else.</span>
				</HeaderLink>
			</div>
			<div class="navigation">
				<ul class="nav-container">
					<li class="nav__item--big">
						<HeaderLink url="{blogRoute}">
							<span class="nav__item">Blog.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--big">
						<HeaderLink url="{projectsRoute}">
							<span class="nav__item">Projects.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--big">
						<HeaderLink url="{aboutRoute}">
							<span class="nav__item">It's me.</span>
						</HeaderLink>
					</li>

					<li class="nav__item--small">
						<HeaderLink url="{blogRoute}">
							<span class="nav__item">Blg.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--small">
						<HeaderLink url="{projectsRoute}">
							<span class="nav__item">Prjcts.</span>
						</HeaderLink>
					</li>
					<li class="nav__item--small">
						<HeaderLink url="{aboutRoute}">
							<span class="nav__item">Me.</span>
						</HeaderLink>
					</li>
				</ul>
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

	.nav-container {
		display: flex;
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
		font-weight: $font-weight-semi;
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

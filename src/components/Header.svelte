<script type="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, toggleTheme, isDarkTheme, defaultTheme } from '../helpers/theme';
	import Button from '../ui/Button.svelte';
	import Link from '../ui/Link.svelte';
	import icoSun from '../assets/icons/sun.svg';
	import icoMoon from '../assets/icons/moon.svg';
	import { RoutePath, toPath } from '../routes';

	const urls = {
		[RoutePath.Home]: toPath(RoutePath.Home),
		[RoutePath.Blog]: toPath(RoutePath.Blog),
		[RoutePath.Projects]: toPath(RoutePath.Projects),
		[RoutePath.About]: toPath(RoutePath.About)
	};

	let theme = defaultTheme;
	let icon = isDarkTheme(defaultTheme) ? icoSun : icoMoon;

	const unsubscribeTheme = onThemeChange(th => (theme = th));

	const switchTheme = () => {
		toggleTheme(theme);
		icon = isDarkTheme(theme) ? icoSun : icoMoon;
	};

	onDestroy(() => unsubscribeTheme());
</script>

<header class="header-wrapper">
	<nav role="navigation" class="header">
		<div class="navigation-wrapper">
			<div class="logo-container">
				<Link url="{urls[RoutePath.Home]}">
					<span class="brand">Nothing Else.</span>
				</Link>
			</div>
			<div class="navigation">
				<ul class="nav-container">
					<li>
						<Link url="{urls[RoutePath.Blog]}">
							<span class="nav-item">Blog.</span>
						</Link>
					</li>
					<li>
						<Link url="{urls[RoutePath.Projects]}">
							<span class="nav-item">Projects.</span>
						</Link>
					</li>
					<li>
						<Link url="{urls[RoutePath.About]}">
							<span class="nav-item">It's me.</span>
						</Link>
					</li>
				</ul>
			</div>
			<div class="theme">
				<div>
					<Button secondary onClick="{switchTheme}" icon="{icon}" hint="Change Theme" />
				</div>
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
		margin-bottom: $unit;
	}

	.navigation-wrapper {
		align-items: center;
		flex: 0 1 $max-content-width;
		display: flex;
	}

	.nav-container {
		display: flex;
	}

	.logo-container {
		flex: 1;
	}

	.brand {
		font-weight: $font-weight-semi;
	}

	@media (min-width: $sm) {
		.brand {
			font-size: $font-size-big;
		}

		.nav-item {
			font-size: $font-size-plus;
		}
	}
</style>

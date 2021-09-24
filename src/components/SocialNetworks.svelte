<script lang="ts">
	import { onDestroy } from 'svelte';
	import Link from '../ui/Link.svelte';
	import { getSocialNetworks } from '../helpers/contacts';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	const networks = getSocialNetworks();

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<div class="social-networks-wrapper">
	{#each networks as network (network.title)}
		<div class="social-networks-item">
			<Link external url="{network.link}">
				<img
					src="{network.image}"
					alt="{network.title}"
					class="logo"
					class:l="{!isDark}"
					class:d="{isDark}"
				/>
			</Link>
		</div>
	{/each}
</div>

<style lang="scss">
	@import '../global';
	@import '../ui/theme';

	.social-networks-wrapper {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.social-networks-item {
		padding: $unit-half;
	}

	.logo {
		@include smooth-change(filter, transform);
		@include image-container($unit-plus);

		&.l {
			@include draw-image-black();
		}

		&.d {
			@include draw-image-white();
		}
	}

	@media (min-width: $sm) {
		.logo {
			@include image-container($unit-double);
		}
	}

	@media (min-width: $md) {
		.logo {
			@include image-container($unit-triple);
		}
	}
</style>

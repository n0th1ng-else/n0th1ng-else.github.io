<script lang="ts">
	import { onDestroy } from 'svelte';
	import icoAnchor from '../assets/icons/anchor.svg';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	export let id: string;

	export let show = false;

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<a class="ui-anchor" class:ui-anchor--shown="{show}" href="#{id}">
	<img src="{icoAnchor}" alt="" class="ui-anchor__logo" class:l="{!isDark}" class:d="{isDark}" />
</a>

<style lang="scss">
	@import '../global';
	@import '../ui/theme';

	.ui-anchor {
		display: none;
		position: absolute;
		left: 0;
		top: $unit + $unit-half;
		transform: translateX(-100%);
		padding-right: $unit-quarter;

		&--shown {
			display: block;
		}

		&__logo {
			@include smooth-change(filter);
			height: $unit - $unit-eighth;
			object-fit: contain;
			width: $unit - $unit-eighth;

			&.l {
				@include draw-image-black();
			}

			&.d {
				@include draw-image-white();
			}
		}
	}
</style>

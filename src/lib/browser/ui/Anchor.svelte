<script lang="ts">
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';
	import icoAnchor from '../../../assets/icons/anchor.svg';

	let { id, show = false }: { id: string; show?: boolean } = $props();

	let isDark = $derived.by(() => isDarkTheme());
</script>

<a class="ui-anchor" class:ui-anchor--shown={show} href="#{id}">
	<img
		src={icoAnchor}
		alt="Link to this section"
		class="ui-anchor__logo"
		class:l={!isDark}
		class:d={isDark}
	/>
</a>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.ui-anchor {
		opacity: 0;

		&:focus {
			opacity: 1;
		}

		&--shown {
			opacity: 1;
		}

		&__logo {
			@include t.smooth-change(filter);
			height: g.$unit - g.$unit-eighth;
			object-fit: contain;
			width: g.$unit - g.$unit-eighth;

			&.l {
				@include t.draw-image-black();
			}

			&.d {
				@include t.draw-image-white();
			}
		}
	}
</style>

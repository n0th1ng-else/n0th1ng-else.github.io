<script lang="ts">
	import { scrollToTop } from '$lib/browser/utils/window';

	import Arrow from './Arrow.svelte';

	const yBorder = 200;
	let y = 0;
</script>

<p class="to-top-container" class:show={y > yBorder}>
	<Arrow onClick={scrollToTop} hint="Scroll to the top of the page" />
</p>

<svelte:window bind:scrollY={y} />

<style lang="scss">
	@use '../ui/theme' as t;
	@use '../../../global' as g;

	.to-top-container {
		@include t.smooth-change(bottom);

		bottom: 0 - (g.$unit * 5);
		position: fixed;
		right: g.$unit-double;

		&.show {
			@media (min-width: t.$md) {
				bottom: 0;
			}
		}
	}
</style>

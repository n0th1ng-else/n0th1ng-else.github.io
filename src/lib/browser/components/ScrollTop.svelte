<script lang="ts">
	import { scrollToTop } from '$lib/browser/utils/window';

	import Arrow from './Arrow.svelte';

	const yBorder = 200;
	let y = 0;
</script>

<p class="to-top-container" class:show={y > yBorder}>
	<Arrow on:click={scrollToTop} hint="Scroll to the top of the page" />
</p>

<svelte:window bind:scrollY={y} />

<style lang="scss">
	@import '../ui/theme';
	@import '../../../global';

	.to-top-container {
		@include smooth-change(bottom);

		bottom: 0 - ($unit * 5);
		position: fixed;
		right: $unit-double;

		&.show {
			@media (min-width: $md) {
				bottom: 0;
			}
		}
	}
</style>

<script lang="ts">
	import Arrow from './Arrow.svelte';
	import { scrollToTop } from '../helpers/scroll';

	const yBorder = 200;
	let y = 0;
</script>

<div class="to-top-container" class:show="{y > yBorder}">
	<Arrow onClick="{scrollToTop}" />
</div>

<svelte:window bind:scrollY="{y}" />

<style lang="scss">
	@import '../global';
	@import '../ui/theme';

	.to-top-container {
		@include smooth-change(bottom);

		bottom: 0 - ($unit * 4);
		position: fixed;
		right: $unit-double;

		&.show {
			@media (min-width: $md) {
				bottom: $unit-double;
			}
		}
	}
</style>

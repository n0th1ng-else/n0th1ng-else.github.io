<script lang="ts">
	export let centered = true;
</script>

<header>
	<h1 class="title" class:centered><slot /></h1>
</header>

<style lang="scss">
	@import './theme';
	@import '../../../global';

	.title {
		@include set-font();
		font-size: $font-size-big;
		font-weight: $font-weight;
		margin: 0;
		padding: ($unit-double + $unit-half) 0 $unit-plus 0;
		text-transform: capitalize;

		&.centered {
			text-align: center;
		}
	}
</style>

<script lang="ts">
	export let centered = true;
</script>

<div>
	<h1 class="title" class:centered><slot /></h1>
</div>

<style lang="scss">
	@import '../global';

	.title {
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

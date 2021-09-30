<div>
	<h2 class="ui-sub"><slot /></h2>
</div>

<style lang="scss">
	@import './theme';
	@import '../global';

	.ui-sub {
		@include set-font();
		font-size: $font-size-plus;
		font-weight: $font-weight;
		margin: 0;
		padding: $unit-plus 0 $unit 0;
	}
</style>

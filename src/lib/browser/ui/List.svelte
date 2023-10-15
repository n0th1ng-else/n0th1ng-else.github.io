<script lang="ts">
	export let type: 'regular' | 'header' = 'regular';
</script>

<ul class="ui-list" class:ui-list--header="{type === 'header'}">
	<slot />
</ul>

<style lang="scss">
	@import './theme';
	@import '../../../global';

	.ui-list {
		@include set-font();
		list-style-type: none;
		margin: 0;
		padding: 0;
		&--header {
			display: flex;
			font-weight: $font-weight-light;
		}
	}
</style>

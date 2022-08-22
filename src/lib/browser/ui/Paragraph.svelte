<script lang="ts">
	export let mono = false;
</script>

<p class="ui-paragraph" class:mono><slot /></p>

<style lang="scss">
	@import './theme';

	.ui-paragraph {
		margin: 0;

		&.mono {
			@include set-font-mono();
		}
	}
</style>

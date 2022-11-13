<script lang="ts">
	export let mono = false;

	export let centered = false;
</script>

<p class="ui-paragraph" class:mono class:centered><slot /></p>

<style lang="scss">
	@import './theme';

	.ui-paragraph {
		margin: 0;

		&.mono {
			@include set-font-mono();
		}

		&.centered {
			text-align: center;
		}
	}
</style>

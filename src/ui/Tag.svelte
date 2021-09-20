<script lang="ts">
	import AdditionalText from './AdditionalText.svelte';

	export let title: string;
</script>

<div class="ui-tag">
	<AdditionalText>#{title}</AdditionalText>
</div>

<style lang="scss">
	@import '../global';

	.ui-tag {
		font-style: italic;
		margin: 0 $unit-quarter;
	}
</style>

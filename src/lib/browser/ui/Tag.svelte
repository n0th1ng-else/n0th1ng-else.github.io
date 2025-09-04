<script lang="ts">
	import AdditionalText from './AdditionalText.svelte';

	export let title: string;
</script>

<p class="ui-tag">
	<AdditionalText>#{title}</AdditionalText>
</p>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.ui-tag {
		@include t.set-font();
		font-style: italic;
		margin-block: 0;
		margin-inline: g.$unit-quarter;
	}
</style>

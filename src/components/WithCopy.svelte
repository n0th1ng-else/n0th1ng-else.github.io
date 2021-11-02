<script lang="ts">
	import { copyToClipboard } from '../helpers/clipboard';

	export let text = '';

	const onClick = () => copyToClipboard(text);
</script>

<span on:click="{onClick}" class="copy-container" title="click to copy to clipboard">
	<slot />
</span>

<style lang="scss">
	.copy-container:hover {
		cursor: pointer;
		text-decoration: underline;
	}
</style>

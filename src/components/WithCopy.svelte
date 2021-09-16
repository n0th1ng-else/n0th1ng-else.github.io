<script lang="ts">
	import { copyToClipboard } from '../helpers/clipboard';
	export let onCopy: () => string;

	const onClick = () => {
		if (!onCopy) {
			return;
		}

		const text = onCopy();
		copyToClipboard(text);
	};
</script>

<div on:click="{onClick}" class="copy-container" title="click to copy to clipboard">
	<slot />
</div>

<style lang="scss">
	.copy-container {
		display: inline;

		&:hover {
			cursor: pointer;
			text-decoration: underline;
		}
	}
</style>

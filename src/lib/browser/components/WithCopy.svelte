<script lang="ts">
	import { copyToClipboard } from '$lib/browser/utils/clipboard';

	export let text = '';

	const onClick = () => copyToClipboard(text);

	const onKeyboard = (evt: KeyboardEvent) => {
		if (evt.key === 'Enter') {
			onClick();
		}
	};
</script>

<span
	on:click={onClick}
	on:keydown={onKeyboard}
	class="copy-container"
	title="click to copy to clipboard"
	tabindex="0"
	role="button"
>
	<slot />
</span>

<style lang="scss">
	.copy-container:hover {
		cursor: pointer;
		text-decoration: underline;
	}
</style>

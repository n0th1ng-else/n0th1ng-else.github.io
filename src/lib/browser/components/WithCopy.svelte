<script lang="ts">
	import { type Snippet } from 'svelte';
	import { copyToClipboard } from '$lib/browser/utils/clipboard';

	let {
		text = '',
		children
	}: {
		text: string;
		children: Snippet;
	} = $props();

	const onClick = (): void => {
		copyToClipboard(text).catch((err: unknown) => {
			// eslint-disable-next-line no-console
			console.error('Unable to copy', err);
		});
	};

	const onKeyboard = (evt: KeyboardEvent) => {
		if (evt.key === 'Enter') {
			onClick();
		}
	};
</script>

<span
	onclick={onClick}
	onkeydown={onKeyboard}
	class="copy-container"
	title="click to copy to clipboard"
	tabindex="0"
	role="button"
>
	{@render children()}
</span>

<style lang="scss">
	.copy-container:hover {
		cursor: pointer;
		text-decoration: underline;
	}
</style>

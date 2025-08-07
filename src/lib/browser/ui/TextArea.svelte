<script lang="ts">
	import { onMount } from 'svelte';
	import type { TextAreaSize } from '$lib/browser/ui/types';

	let {
		text = $bindable(),
		placeholder,
		size = 'md'
	}: {
		text: string;
		placeholder: string;
		size?: TextAreaSize;
	} = $props();

	let ref: HTMLTextAreaElement;

	const detectElementHeight = () => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!ref) {
			return;
		}
		ref.style.height = 'auto';
		ref.style.height = `${ref.scrollHeight}px`;
	};
	const onChange = () => {
		detectElementHeight();
	};

	onMount(() => {
		detectElementHeight();
	});
	$effect(() => {
		detectElementHeight();
	});
</script>

<textarea
	{placeholder}
	class="ui-textarea ui-textarea--{size}"
	bind:value={text}
	bind:this={ref}
	oninput={onChange}
></textarea>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.ui-textarea {
		@include t.set-font();
		background-color: t.$cl-grey-lightest;
		border: 0;
		padding: 0;
		resize: none;
		width: 100%;

		&:focus {
			outline: none;
		}

		&--xl {
			font-size: g.$font-size-huge;
			font-weight: g.$font-weight-bold;
		}

		&--lg {
			font-size: g.$font-size-bigger;
		}

		&--md {
			font-size: g.$font-size-big;
		}

		&--sm {
			font-size: g.$font-size-plus;
		}
	}
</style>

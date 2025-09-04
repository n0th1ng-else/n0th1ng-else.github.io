<script lang="ts">
	import 'highlight.js/scss/github-dark.scss';
	// import { convertMarkdown } from '$lib/common/api';
	import { keywordsFromString } from '$lib/browser/utils/keywords';

	import TextArea from './TextArea.svelte';

	let {
		title = $bindable(''),
		keywords = $bindable(''),
		content = $bindable(''),
		logo = '',
		preview = false
	}: {
		title?: string;
		keywords?: string;
		content?: string;
		logo?: string;
		preview?: boolean;
	} = $props();

	const convertMarkdown = async (text: string): Promise<string> => {
		// TODO implement
		return Promise.resolve(text);
	};

	let tags = $state<string[]>([]);

	$effect.pre(() => {
		if (preview) {
			tags = keywordsFromString(keywords);
		}
	});
</script>

<div class="editor__container">
	{#if preview}
		<div class="editor__preview">
			<div>
				<h1>{title}</h1>
			</div>
			<p>
				{#each tags as tag (tag)}
					<span class="editor__tag">#{tag}</span>
				{/each}
			</p>
			{#if logo}
				<p>
					<img class="editor__logo" src={logo} alt="" />
				</p>
			{/if}
			<div>
				{#await convertMarkdown(content)}
					Converting...
				{:then md}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html md}
				{:catch error}
					{error.message}
				{/await}
			</div>
		</div>
	{:else}
		<div class="editor__content">
			<p>
				<TextArea bind:text={title} size="xl" placeholder="Create a title..." />
			</p>
			<p>
				<TextArea bind:text={keywords} size="md" placeholder="Add a few keywords..." />
			</p>
		</div>
		<p class="editor__content">
			<TextArea bind:text={content} size="sm" placeholder="Start the article..." />
		</p>
	{/if}
</div>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.editor {
		&__container {
			background-color: t.$cl-grey-lightest;
			border: 1px solid t.$cl-grey-dark;
			border-radius: g.$unit-half;
			padding-block: g.$unit-double;
			padding-inline: g.$unit-triple;
		}

		&__content {
			padding-block: g.$unit-double;
			padding-inline: g.$unit-triple;
		}

		&__preview {
			color: t.$cl-black;
		}

		&__tag {
			color: t.$l-secondary;
			margin: g.$unit-quarter;
		}

		&__logo {
			margin-block-start: g.$unit-half;
			width: 100%;
			object-fit: fill;
		}
	}
</style>

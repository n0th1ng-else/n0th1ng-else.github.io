<script lang="ts">
	import 'highlight.js/scss/github-dark.scss';
	import { beforeUpdate } from 'svelte';
	import TextArea from './TextArea.svelte';
	import { keywordsFromString } from '../helpers/keywords';
	import { convertMarkdown } from '../helpers/api';

	export let title = '';
	export let keywords = '';
	export let content = '';

	export let preview = false;

	let tags: string[] = [];
	beforeUpdate(async () => {
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
			<div>
				{#each tags as tag}
					<span class="editor__tag">#{tag}</span>
				{/each}
			</div>
			<div>
				{#await convertMarkdown(content)}
					Converting...
				{:then md}
					{@html md}
				{:catch error}
					{error.message}
				{/await}
			</div>
		</div>
	{:else}
		<div class="editor__content">
			<div>
				<TextArea bind:text="{title}" size="xl" placeholder="Create a title..." />
			</div>
			<div>
				<TextArea bind:text="{keywords}" size="m" placeholder="Add a few keywords..." />
			</div>
		</div>
		<div class="editor__content">
			<TextArea bind:text="{content}" size="s" placeholder="Start the article..." />
		</div>
	{/if}
</div>

<style lang="scss">
	@import 'src/global';
	@import 'src/ui/theme';

	.editor {
		&__container {
			background-color: $cl-grey-lighter;
			border: 1px solid $cl-grey-dark;
			border-radius: $unit-half;
			padding: $unit-double $unit-triple;
		}

		&__content {
			padding: $unit-double $unit-triple;
		}

		&__preview {
			color: $cl-black;
		}

		&__tag {
			color: $l-secondary;
			margin: $unit-quarter;
		}
	}
</style>

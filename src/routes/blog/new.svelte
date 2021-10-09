<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const host = page.host;
		const path = page.path;

		return {
			props: {
				pageUrl: `${host}${path}`
			}
		};
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/env';
	import Button from '../../ui/Button.svelte';
	import Meta from '../../ui/Meta.svelte';
	import Editor from '../../ui/Editor.svelte';
	import icoOk from '../../assets/icons/ok.svg';
	import { newArticleTitle } from '../../labels';
	import { getProfile } from '../../helpers/selectors';
	import { openFile, saveToFile } from '../../helpers/files';
	import { Logger } from '../../helpers/log';
	import type { FileHandle } from '../../types';
	import type { MarkdownFormat } from '../../types';
	import { keywordsFromString } from '../../helpers/keywords';
	import { getDateTime } from '../../helpers/date';

	export let pageUrl: string;

	const photo = getProfile().image ?? '';

	const logger = new Logger('file access');

	let preview = false;
	let title = '';
	let keywords = '';
	let content = '';
	let file: FileHandle | undefined = undefined;
	let noticeDate: Date | null = null;

	const togglePreview = () => (preview = !preview);

	const open = () => {
		openFile<MarkdownFormat>()
			.then(data => {
				title = data.title || '';
				keywords = (data.keywords || []).join(', ');
				content = data.content || '';
			})
			.catch(err => logger.error('Unable to load file', err));
	};

	const save = (useExistingFile = false) => {
		noticeDate = null;
		const data: MarkdownFormat = {
			title,
			content,
			keywords: keywordsFromString(keywords)
		};
		saveToFile(data, useExistingFile ? file : undefined)
			.then(fileHandle => {
				file = fileHandle;
				noticeDate = new Date();
			})
			.catch(err => logger.error('Unable to save the file', err));
	};

	const saveOnKey = (evt: KeyboardEvent) => {
		const isMetaPressed = evt.ctrlKey || evt.metaKey;
		if (isMetaPressed && evt.key === 's') {
			evt.stopPropagation();
			evt.preventDefault();
			const useExistingFile = true;
			save(useExistingFile);
		}
	};

	if (browser) {
		document.addEventListener<'keydown'>('keydown', saveOnKey);
	}
	onDestroy(() => {
		if (browser) {
			document.removeEventListener<'keydown'>('keydown', saveOnKey);
		}
	});
</script>

<Meta image="{photo}" description="Article editor" url="{pageUrl}" />
<div>
	<div class="controls-container">
		<div class="main-controls-container">
			<div>
				<Button onClick="{open}">Load file</Button>
			</div>
			<div class="save-block">
				<div class="save-control">
					<Button onClick="{save}">Save the article</Button>
				</div>
			</div>
			{#if noticeDate}
				<div class="save-note">
					<img src="{icoOk}" alt="" class="save-note__logo" />
				</div>
				<div class="save-note__text">changes saved at {getDateTime(noticeDate)}</div>
			{/if}
		</div>
		<div>
			<Button onClick="{togglePreview}">{preview ? 'Edit' : 'Preview'}</Button>
		</div>
	</div>
	<div class="editor-container">
		<Editor bind:title bind:keywords bind:content preview="{preview}" />
	</div>
</div>

<svelte:head>
	<title>{newArticleTitle}</title>
</svelte:head>

<style lang="scss">
	@import '../../global';

	.editor-container {
		padding-top: $unit;
	}

	.controls-container {
		display: flex;
		justify-content: space-between;
	}

	.main-controls-container {
		display: flex;
		align-items: center;
	}

	.save-control {
		display: flex;
	}

	.save-block,
	.save-note {
		margin-left: $unit;
	}

	.save-note {
		&__logo {
			// https://codepen.io/sosuke/pen/Pjoqqp
			filter: invert(51%) sepia(81%) saturate(1269%) hue-rotate(83deg) brightness(99%) contrast(94%);
			height: $unit + $unit-quarter;
			vertical-align: text-bottom;
		}

		&__text {
			margin-left: $unit-eighth;
		}
	}
</style>

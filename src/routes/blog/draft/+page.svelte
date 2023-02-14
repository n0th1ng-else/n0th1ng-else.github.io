<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { profileStore } from '$lib/browser/stores';
	import { uploadImage } from '$lib/browser/utils/upload';
	import { Logger } from '$lib/common/log';
	import { getDateTime } from '$lib/common/date';
	import Button from '$lib/browser/ui/Button.svelte';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import Editor from '$lib/browser/ui/Editor.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import { openJsonFile, openImageFile, saveJsonFile } from '$lib/browser/utils/files';
	import { keywordsFromString } from '$lib/browser/utils/keywords';
	import { newArticleTitle } from '$lib/common/labels';
	import icoOk from '../../../assets/icons/ok.svg';
	import type { FileHandle } from '../../../types';
	import type { MarkdownFormat } from '../../../types';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url } = data;

	const logger = new Logger('file access');

	let preview = false;
	let title = '';
	let keywords = '';
	let content = '';
	let file: FileHandle | undefined = undefined;
	let noticeDate: Date | null = null;
	let logo = '';

	const togglePreview = () => (preview = !preview);

	const open = () => {
		openJsonFile<MarkdownFormat>()
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
		saveJsonFile(data, useExistingFile ? file : undefined)
			.then(fileHandle => {
				file = fileHandle;
				noticeDate = new Date();
			})
			.catch(err => logger.error('Unable to save the file', err));
	};

	const saveNewFile = () => save();

	const uploadLogo = () =>
		openImageFile()
			.then(file => uploadImage(file))
			.then(imageUrl => (logo = imageUrl))
			.catch(err => logger.error('Unable to upload the image', err));

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

<Meta image={$profileStore?.image ?? ''} description="Article editor" {url} />
<article>
	<SubTitle centered>New article</SubTitle>
	<div class="controls-container">
		<div class="main-controls-container">
			<p>
				<Button on:click={open}>Load file</Button>
			</p>
			<div class="save-block">
				<p class="save-control">
					<Button on:click={saveNewFile}>Save the article</Button>
				</p>
			</div>
			{#if noticeDate}
				<p class="save-note">
					<img src={icoOk} alt="" class="save-note__logo" />
				</p>
				<p class="save-note__text">changes saved at {getDateTime(noticeDate)}</p>
			{/if}
		</div>
		<p>
			<Button on:click={togglePreview}>{preview ? 'Edit' : 'Preview'}</Button>
		</p>
	</div>
	<p class="logo-btn">
		<Button secondary inline on:click={uploadLogo}>Upload logo</Button>
	</p>
	<div class="editor-container">
		<Editor bind:title bind:keywords bind:content {preview} {logo} />
	</div>
</article>

<svelte:head>
	<title>{newArticleTitle}</title>
</svelte:head>

<style lang="scss">
	@import '../../../global';

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

	.logo-btn {
		margin-top: $unit-half;
	}
</style>

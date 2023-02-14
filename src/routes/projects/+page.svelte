<script lang="ts">
	import { browser } from '$app/environment';
	import { accountsStore, profileStore } from '$lib/browser/stores';
	import Title from '$lib/browser/ui/Title.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import Link from '$lib/browser/ui/Link.svelte';
	import Card from '$lib/browser/ui/Card.svelte';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import { projectsTitle as title } from '$lib/common/labels';
	import { getWorkProjects, getPetProjects } from '$lib/browser/utils/projects';
	import { getGitHubContact } from '$lib/browser/utils/contacts';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url, packages } = data;

	const gh = $accountsStore ? getGitHubContact($accountsStore) : null;
	const workProjects = getWorkProjects();
	const petProjects = $accountsStore ? getPetProjects(packages, $accountsStore) : [];
</script>

<Meta
	image={$profileStore?.image ?? ''}
	description="Big and small noticeable projects I am contributing to. Most of them related to Frontend or NodeJS. Find them all in the my GitHub account."
	{url}
/>
<article>
	<Title>Projects</Title>
	<SubTitle>
		A few highlights of my pet projects. View them all on <Link external inline url={gh?.link}
			>{gh?.title}</Link
		>.
	</SubTitle>
	<div class="projects-container">
		{#each petProjects as item (item.name)}
			<div class="project-container">
				<Card {item} extended readonly={!browser} />
			</div>
		{/each}
	</div>

	<SubTitle>My career path</SubTitle>
	<div class="projects-container">
		{#each workProjects as item (item.name)}
			<div class="project-container">
				<Card {item} extended readonly={!browser} />
			</div>
		{/each}
	</div>
</article>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../../global';

	.projects-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.project-container {
		flex: 0 1 $project-width;
		margin: $unit-half;
	}
</style>

<script lang="ts">
	import Title from '../ui/Title.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import Link from '../ui/Link.svelte';
	import ProjectItem from '../components/ProjectItem.svelte';
	import { projectsTitle as title } from '../labels';
	import { getGitHubContact } from '../helpers/contacts';
	import { getWorkProjects, getPetProjects } from '../helpers/projects';

	const gh = getGitHubContact();
	const workProjects = getWorkProjects();
	const petProjects = getPetProjects();
</script>

<div>
	<Title>Projects</Title>
	<SubTitle>
		A few highlights of my pet projects. View them all on <Link external inline url="{gh.link}"
			>{gh.title}</Link
		>.
	</SubTitle>
	<div class="projects-container">
		{#each petProjects as item (item.name)}
			<ProjectItem item="{item}" />
		{/each}
	</div>

	<SubTitle>My career path</SubTitle>
	<div class="projects-container">
		{#each workProjects as item (item.name)}
			<ProjectItem item="{item}" />
		{/each}
	</div>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	.projects-container {
		display: flex;
	}
</style>

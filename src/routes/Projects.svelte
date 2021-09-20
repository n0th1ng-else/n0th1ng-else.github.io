<script lang="ts">
	import Title from '../ui/Title.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import Link from '../ui/Link.svelte';
	import Card from '../ui/Card.svelte';
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
			<div class="project-container">
				<Card item="{item}" />
			</div>
		{/each}
	</div>

	<SubTitle>My career path</SubTitle>
	<div class="projects-container">
		{#each workProjects as item (item.name)}
			<div class="project-container">
				<Card item="{item}" />
			</div>
		{/each}
	</div>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../global';

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

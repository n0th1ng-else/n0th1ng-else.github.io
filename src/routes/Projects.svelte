<script lang="ts">
	import Title from '../ui/Title.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import Link from '../ui/Link.svelte';
	import { projectsTitle as title } from '../labels';
	import { getGitHubContact } from '../helpers/contacts';

	const gh = getGitHubContact();
</script>

<div>
	<Title>Projects</Title>
	<SubTitle>
		A few highlights of my pet projects. View them all on <Link external inline url="{gh.link}"
			>{gh.title}</Link
		>.
	</SubTitle>
	<SubTitle>My career path</SubTitle>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

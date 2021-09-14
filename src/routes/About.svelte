<script lang="ts">
	import Title from '../ui/Title.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import { aboutTitle as title } from '../labels';
</script>

<div>
	<Title>About Sergey</Title>
	<SubTitle>Connect</SubTitle>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

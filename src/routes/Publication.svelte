<style>
	.flex-right {
		margin: 0 10px;
		justify-content: flex-end;
	}
</style>

<script>
	import Switch from '@smui/switch';
	import FormField from '@smui/form-field';
	import Publication from '../components/Publication.svelte';

	let selected = false;

	const publications = runtime.meta.publications;

	const pubsByLang = publications.reduce((res, pub) => {
		res[pub.lang] ? res[pub.lang].push(pub) : (res[pub.lang] = [pub]);
		res[pub.lang] = res[pub.lang].sort(
			(iA, iB) => new Date(iB.meta.date).getTime() - new Date(iA.meta.date).getTime()
		);
		return res;
	}, {});

	let pubsToRender = getPublications(selected);

	function updateList() {
		pubsToRender = getPublications(selected);
	}

	function getPublications(isSelected) {
		const lang = isSelected ? 'ru' : 'en';
		return pubsByLang[lang] || [];
	}
</script>

<svelte:head>
	<title>Sergey Nikitin | Publications</title>
</svelte:head>

<div>
	<div class="flex-container flex-right">
		<div>
			<FormField align="end">
				<Switch bind:checked="{selected}" on:change="{updateList}" />
				<span slot="label">Show publications in Russian</span>
			</FormField>
		</div>
	</div>
	<div>
		{#each pubsToRender as pub (pub.fullUrl)}
			<Publication publication="{pub}" />
		{/each}
	</div>
</div>

<script lang="ts">
	import { profileStore } from '$lib/browser/stores';
	import Meta from '$lib/browser/ui/Meta.svelte';
	import NotFound from '$lib/browser/components/NotFound.svelte';
	import { notFoundTitle as title } from '$lib/common/labels';
	import type { PageData } from './$types';

	export let data: PageData;

	const { url } = data;

	const photo = $profileStore?.image ?? '';
</script>

<Meta image="{photo}" description="{title}" url="{url}" />

<NotFound />

<svelte:head>
	<title>{title}</title>
</svelte:head>

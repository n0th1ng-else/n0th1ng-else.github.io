<script lang="ts">
	import NotFound from '$lib/browser/components/NotFound.svelte';
	import { notFoundTitle as title } from '$lib/common/labels';
</script>

<NotFound />

<svelte:head>
	<title>{title}</title>
</svelte:head>

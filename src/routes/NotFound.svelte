<script lang="ts">
	import { getPageTitle, PageState } from '../labels';
</script>

<div>Not found</div>

<svelte:head>
	<title>{getPageTitle(PageState.NotFound)}</title>
</svelte:head>

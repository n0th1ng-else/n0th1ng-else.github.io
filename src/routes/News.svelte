<script lang="ts">
	import { getPageTitle } from '../labels';
	import { RoutePath } from '.';
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.News)}</title>
</svelte:head>

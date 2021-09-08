<script lang="ts">
	import { RoutePath } from '.';
	import { getPageTitle } from '../labels';
</script>

<div>Home</div>

<svelte:head>
	<title>{getPageTitle(RoutePath.Home)}</title>
</svelte:head>

<script lang="ts">
	import { RoutePath } from '.';
	import { getPageTitle } from '../labels';
</script>

<div>About</div>

<svelte:head>
	<title>{getPageTitle(RoutePath.About)}</title>
</svelte:head>

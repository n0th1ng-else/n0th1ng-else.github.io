<script lang="ts">
	import { RoutePath } from '.';
	import { getPageTitle } from '../labels';
</script>

<div>Blog</div>

<svelte:head>
	<title>{getPageTitle(RoutePath.Blog)}</title>
</svelte:head>

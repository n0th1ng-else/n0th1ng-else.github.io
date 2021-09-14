<script lang="ts">
	import Link from '../ui/Link.svelte';
	import { homeTitle as title } from '../labels';
	import { blogRoute } from '../routes';
</script>

<div>
	<p>
		More posts can be found in the <Link inline url="{blogRoute}">Blog</Link>.
	</p>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const host = page.host;
		const path = page.path;

		return {
			props: {
				pageUrl: `${host}${path}`
			}
		};
	};
</script>

<script lang="ts">
	import Meta from '../../ui/Meta.svelte';
	import { newArticleTitle as title } from '../../labels';
	import { getProfile } from '../../helpers/selectors';

	export let pageUrl: string;

	const photo = getProfile().image ?? '';
</script>

<Meta image="{photo}" description="Article editor" url="{pageUrl}" />
<div>New article</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

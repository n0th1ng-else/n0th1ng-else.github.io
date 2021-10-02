<script lang="ts">
	import Meta from '../../ui/Meta.svelte';
	import { newArticleTitle as title } from '../../labels';
	import { getProfile } from '../../helpers/selectors';

	const photo = getProfile().image ?? '';
</script>

<Meta image="{photo}" description="Article editor" />
<div>New article</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

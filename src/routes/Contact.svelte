<script lang="ts">
	import { getPageTitle } from '../labels';
	import { RoutePath } from '.';
	import TwitterWidget from '../components/TwitterWidget.svelte';

	const twitterAccount = runtime.env.accounts.twitter;
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Contact)}</title>
</svelte:head>

<div>
	{#if twitterAccount}
		<TwitterWidget account="{twitterAccount}" />
	{/if}
</div>

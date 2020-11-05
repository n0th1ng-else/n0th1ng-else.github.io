<script lang="ts">
	import TwitterWidget from '../components/TwitterWidget.svelte';
	import { RoutePath } from '.';
	import { getPageTitle } from '../labels';
	import { getAccounts } from '../helpers/global';

	const accounts = getAccounts();
	const twitterAccount: string = accounts.twitter;
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Contact)}</title>
</svelte:head>

<div>
	{#if twitterAccount}
		<TwitterWidget account="{twitterAccount}" />
	{/if}
</div>

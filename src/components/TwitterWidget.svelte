<script>
	export let account = '';
	const twitterUrl = `https://twitter.com/${account}?ref_src=twsrc%5Etfw`;
	const twitterLabel = `Follow @${account}`;
</script>

<div data-icon="ei-sc-twitter"></div>

<a href="{twitterUrl}" class="twitter-follow-button" data-show-count="false">{twitterLabel}</a>

<svelte:head>
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8">

	</script>
</svelte:head>

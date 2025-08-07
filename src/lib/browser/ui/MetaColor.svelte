<script lang="ts">
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';

	let isDark = $derived.by(() => isDarkTheme());
</script>

<svelte:head>
	<meta name="theme-color" content={isDark ? '#072638' : '#ffffff'} />
</svelte:head>

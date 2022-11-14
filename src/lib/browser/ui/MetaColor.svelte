<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme } from '$lib/browser/stores/theme';

	let isDark = true;

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<svelte:head>
	<meta name="theme-color" content="{isDark ? '#072638' : '#ffffff'}" />
</svelte:head>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	onDestroy(() => unsubscribeTheme());
</script>

<svelte:head>
	<meta name="theme-color" content="{isDark ? '#072638' : '#ffffff'}" />
</svelte:head>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import Anchor from './Anchor.svelte';
	import { onThemeChange, isDarkTheme, defaultTheme } from '../helpers/theme';

	let isDark = isDarkTheme(defaultTheme);

	const unsubscribeTheme = onThemeChange(th => (isDark = isDarkTheme(th)));

	export let id = '';

	let show = false;

	const showAnchor = () => {
		if (!id) {
			return;
		}

		show = true;
	};

	const hideAnchor = () => (show = false);

	onDestroy(() => unsubscribeTheme());
</script>

<div class="ui-sub__container">
	{#if id}
		<h2
			id="{id}"
			class="ui-sub"
			class:l="{!isDark}"
			class:d="{isDark}"
			on:focus="{showAnchor}"
			on:mouseover="{showAnchor}"
			on:mouseleave="{hideAnchor}"
		>
			<Anchor id="{id}" show="{show}" />
			<slot />
		</h2>
	{:else}
		<h2 class="ui-sub" class:l="{!isDark}" class:d="{isDark}">
			<slot />
		</h2>
	{/if}
</div>

<style lang="scss">
	@import './theme';
	@import '../global';

	@mixin subtitle-style($color) {
		@include smooth-change(color);

		color: $color;
	}

	.ui-sub {
		@include set-font();
		font-size: $font-size-plus;
		font-weight: $font-weight;
		margin: 0;
		padding: $unit-plus 0 $unit 0;
		position: relative;

		&.l {
			@include subtitle-style($l-primary);
		}

		&.d {
			@include subtitle-style($d-primary);
		}
	}
</style>

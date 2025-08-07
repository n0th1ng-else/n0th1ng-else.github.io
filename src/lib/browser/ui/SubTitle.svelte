<script lang="ts">
	import { type Snippet } from 'svelte';
	import { isDarkTheme } from '$lib/browser/stores/theme.svelte';
	import Anchor from './Anchor.svelte';

	let {
		inline = false,
		centered = false,
		id = '',
		children
	}: {
		inline?: boolean;
		centered?: boolean;
		id?: string;
		children: Snippet;
	} = $props();

	let show = $state(false);

	const showAnchor = () => {
		if (!id) {
			return;
		}

		show = true;
	};

	const hideAnchor = () => (show = false);

	let isDark = $derived.by(() => isDarkTheme());
</script>

<div class="ui-sub__container">
	{#if id}
		<h2
			{id}
			class="ui-sub"
			class:l={!isDark}
			class:d={isDark}
			class:header={!inline}
			class:centered
			onfocus={showAnchor}
			onmouseover={showAnchor}
			onmouseleave={hideAnchor}
		>
			{@render children()}
			<Anchor {id} {show} />
		</h2>
	{:else}
		<h2 class="ui-sub" class:l={!isDark} class:d={isDark} class:header={!inline} class:centered>
			{@render children()}
		</h2>
	{/if}
</div>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	@mixin subtitle-style($color) {
		@include t.smooth-change(color);

		color: $color;
	}

	.ui-sub {
		@include t.set-font();
		font-size: g.$font-size;
		font-weight: g.$font-weight;
		margin: 0;

		&.header {
			font-size: g.$font-size-plus;
			margin-block: g.$unit-plus g.$unit;
			position: relative;
		}

		&.centered {
			text-align: center;
		}

		&.l {
			@include subtitle-style(t.$l-primary);
		}

		&.d {
			@include subtitle-style(t.$d-primary);
		}
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		mono = false,
		centered = false,
		flat = false,
		printVisible = true,
		children
	}: {
		mono?: boolean;
		centered?: boolean;
		flat?: boolean;
		printVisible?: boolean;
		children: Snippet;
	} = $props();
</script>

<p class="ui-paragraph" class:mono class:centered class:flat class:no-print={!printVisible}>
	{@render children()}
</p>

<style lang="scss">
	@use './theme' as t;
	@use '../../../global' as g;

	.ui-paragraph {
		margin: g.$unit-half;

		&.flat {
			margin: 0;
		}

		&.mono {
			@include t.set-font-mono();
		}

		&.centered {
			text-align: center;
		}
	}

	@media print {
		.no-print {
			display: none;
		}
	}
</style>

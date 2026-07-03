<script lang="ts">
	import { blogRoute, projectsRoute, aboutRoute, readingListRoute } from '$lib/common/routes';
	import HeaderLink from '$lib/browser/ui/HeaderLink.svelte';
	import List from '$lib/browser/ui/List.svelte';

	export let activePath = '';
	export let hasReadingList = false;
</script>

<List type="header">
	<li>
		<HeaderLink url={blogRoute} active={blogRoute === activePath}>
			<span class="nav__item">Blog.</span>
		</HeaderLink>
	</li>
	<li>
		<HeaderLink url={projectsRoute} active={projectsRoute === activePath}>
			<span class="nav__item">Projects.</span>
		</HeaderLink>
	</li>
	{#if hasReadingList}
		<li>
			<HeaderLink
				url={readingListRoute}
				active={readingListRoute === activePath}
				label="Reading list"
			>
				<!-- The link's aria-label carries the full name; the visual label shrinks on small screens. -->
				<span class="nav__item nav__item--full" aria-hidden="true">Reading.</span>
				<span class="nav__item nav__item--short" aria-hidden="true">Rng.</span>
			</HeaderLink>
		</li>
	{/if}
	<li>
		<HeaderLink url={aboutRoute} active={aboutRoute === activePath} label="About me">
			<span class="nav__item">It's me.</span>
		</HeaderLink>
	</li>
</List>

<style lang="scss">
	@use '../ui/theme' as t;
	@use '../../../global' as g;

	@media (min-width: t.$md) {
		.nav__item {
			font-size: g.$font-size-plus;
		}
	}

	.nav__item--full {
		display: none;
	}

	.nav__item--short {
		display: inline;
	}

	@media (min-width: t.$sm) {
		.nav__item--full {
			display: inline;
		}

		.nav__item--short {
			display: none;
		}
	}
</style>

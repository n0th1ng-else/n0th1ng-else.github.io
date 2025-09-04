<script lang="ts">
	import Link from '$lib/browser/ui/Link.svelte';
	import Paragraph from '$lib/browser/ui/Paragraph.svelte';
	import SubTitle from '$lib/browser/ui/SubTitle.svelte';
	import { blogRoute } from '$lib/common/routes';
	import imageNotFound from '../../../assets/images/not-found.svg';
</script>

<article>
	<SubTitle centered>Ops, bumped into empty space?</SubTitle>

	<aside class="container">
		<img class="image" src={imageNotFound} alt="" title="Page not found" />
	</aside>

	<Paragraph centered flat>
		One day something funny would appear on this page... But for now, I was not able to find
		anything for you, really. My bad. Check out <Link inline url={blogRoute}>my blog</Link>, if you
		have not already
	</Paragraph>
</article>

<style lang="scss">
	@use '../../../lib/browser/ui/theme' as t;
	@use '../../../global' as g;

	.image {
		height: 100%;
		object-fit: contain;
		width: 100%;
	}

	.container {
		margin: auto;
		height: auto;
		padding-block: g.$unit;
		padding-inline: 0;
		width: 4 * g.$unit-plus;
	}

	@media (min-width: t.$sm) {
		.container {
			width: 6 * g.$unit-plus;
		}
	}

	@media (min-width: t.$md) {
		.container {
			width: 10 * g.$unit-plus;
		}
	}
</style>

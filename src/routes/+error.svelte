<script lang="ts">
	import Link from '$lib/browser/ui/Link.svelte';
	import Paragraph from '$lib/browser/ui/Paragraph.svelte';
	import imageNotFound from '../assets/images/not-found.svg';
	import { notFoundTitle as title } from '$lib/common/labels';
	import { blogRoute } from '$lib/common/routes.js';
</script>

<article>
	<aside class="image-container">
		<img class="image" src="{imageNotFound}" alt="" />
	</aside>
	<section class="text-container">
		<Paragraph>One day something funny would appear on this page...</Paragraph>
		<Paragraph>But for now, I was not able to find anything for you, really. My bad.</Paragraph>
		<Paragraph>
			Check out <Link inline url="{blogRoute}">my blog</Link>, if you have not already
		</Paragraph>
	</section>
</article>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../lib/browser/ui/theme';
	@import '../global';

	.text-container {
		margin-top: $unit;
		text-align: center;
	}

	.image {
		height: 100%;
		object-fit: contain;
		width: 100%;
	}

	.image-container {
		margin: auto;
		height: auto;
		width: 4 * $unit-plus;
	}

	@media (min-width: $sm) {
		.image-container {
			width: 6 * $unit-plus;
		}
	}

	@media (min-width: $md) {
		.image-container {
			width: 10 * $unit-plus;
		}
	}
</style>

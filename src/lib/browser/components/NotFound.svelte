<script lang="ts">
	import Link from '$lib/browser/ui/Link.svelte';
	import Paragraph from '$lib/browser/ui/Paragraph.svelte';
	import { blogRoute } from '$lib/common/routes';
	import imageNotFound from '../../../assets/images/not-found.svg';
</script>

<article>
	<aside class="container">
		<img class="image" src="{imageNotFound}" alt="" title="Page not found" />
	</aside>
	<section class="text">
		<Paragraph>One day something funny would appear on this page...</Paragraph>
		<Paragraph>But for now, I was not able to find anything for you, really. My bad.</Paragraph>
		<Paragraph>
			Check out <Link inline url="{blogRoute}">my blog</Link>, if you have not already
		</Paragraph>
	</section>
</article>

<style lang="scss">
	@import '../../../lib/browser/ui/theme';
	@import '../../../global';

	.text {
		margin-top: $unit;
		text-align: center;
	}

	.image {
		height: 100%;
		object-fit: contain;
		width: 100%;
	}

	.container {
		margin: auto;
		height: auto;
		width: 4 * $unit-plus;
	}

	@media (min-width: $sm) {
		.container {
			width: 6 * $unit-plus;
		}
	}

	@media (min-width: $md) {
		.container {
			width: 10 * $unit-plus;
		}
	}
</style>

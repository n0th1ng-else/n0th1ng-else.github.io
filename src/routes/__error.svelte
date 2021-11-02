<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const host = page.host;
		const path = page.path;

		return {
			props: {
				pageUrl: `${host}${path}`
			}
		};
	};
</script>

<script lang="ts">
	import Link from '../ui/Link.svelte';
	import Meta from '../ui/Meta.svelte';
	import Paragraph from '../ui/Paragraph.svelte';
	import imageNotFound from '../assets/images/not-found.svg';
	import { notFoundTitle as title } from '../labels';
	import { blogRoute } from '../helpers/routes';
	import { getProfile } from '../helpers/selectors';

	export let pageUrl: string;

	const photo = getProfile().image ?? '';
</script>

<Meta
	image="{photo}"
	description="Page not found. But you can still navigate to the other meaningful sections."
	url="{pageUrl}"
/>
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
	@import '../ui/theme';
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

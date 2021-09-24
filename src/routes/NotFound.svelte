<script lang="ts">
	import Link from '../ui/Link.svelte';
	import imageNotFound from '../assets/images/not-found.svg';
	import { notFoundTitle as title } from '../labels';
	import { blogRoute } from '.';

	export let params: {
		wild?: string;
	} = {};
</script>

<div>
	<div class="image-container">
		<img class="image" src="{imageNotFound}" alt="" />
	</div>
	<div class="text-container">
		<p class="text">One day something funny would appear on this page...</p>
		<p class="text">But for now, I was not able to find anything for you, really. My bad.</p>
		<p class="text">
			Check out <Link inline url="{blogRoute}">my blog</Link>, if you have not already
		</p>
	</div>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../ui/theme';
	@import '../global';

	.text-container {
		margin-top: $unit;
	}

	.text {
		margin: 0;
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

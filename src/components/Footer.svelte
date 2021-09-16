<script lang="ts">
	import AdditionalText from '../ui/AdditionalText.svelte';
	import Footer from '../ui/Footer.svelte';
	import SocialNetworks from './SocialNetworks.svelte';
	import Link from '../ui/Link.svelte';
	import { getVersion } from '../helpers/selectors';
	import { legalRoute } from '../routes';
	import { getFirstContentfulPaint } from '../helpers/metrics';

	const version = `v2-${getVersion()}`;
	let fcp = '';
	getFirstContentfulPaint(time => (fcp = time));
</script>

<Footer>
	<div class="legal centered w-space">
		<div class="legal__part">
			<AdditionalText>
				My posts reflect my own views and may not be those of my employer
			</AdditionalText>
		</div>
		<div class="legal__part">
			<AdditionalText>
				Unless otherwise noted, all code is free to use under the
				<Link inline url="{legalRoute}">MIT License</Link>
			</AdditionalText>
		</div>
	</div>
	<div class="author on-right w-space">
		<div>
			<AdditionalText>© 2021 Sergey Nikitin</AdditionalText>
		</div>
		<div>
			<AdditionalText>
				Made with <Link inline external url="https://svelte.dev">Svelte</Link> with 🧡
			</AdditionalText>
		</div>
		<div>
			<AdditionalText>{version}</AdditionalText>
		</div>
	</div>
	<div class="network centered w-space">
		<SocialNetworks />
	</div>
	{#if fcp}
		<div class="centered w-space">
			<AdditionalText small>first contentful paint took {fcp}s</AdditionalText>
		</div>
	{/if}
</Footer>

<style lang="scss">
	@import '../global';

	.centered {
		align-self: center;
	}

	.on-right {
		align-self: flex-end;
	}

	.w-space {
		margin: $unit $unit-half;
	}

	.legal {
		text-align: center;

		&__part {
			padding: $unit-quarter;
		}
	}
</style>

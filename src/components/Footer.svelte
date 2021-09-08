<script lang="ts">
	import AdditionalText from '../ui/AdditionalText.svelte';
	import Footer from '../ui/Footer.svelte';
	import SocialNetworks from './SocialNetworks.svelte';
	import Link from '../ui/Link.svelte';
</script>

<Footer>
	<div class="legal centered w-space">
		<AdditionalText>
			My posts reflect my own views and may not be those of my employer
		</AdditionalText>
	</div>
	<div class="author on-right w-space">
		<div class="copyright">
			<AdditionalText>© 2021 Sergey Nikitin</AdditionalText>
		</div>
		<div class="madeby">
			<AdditionalText>
				Made with <Link inline external url="https://svelte.dev">Svelte</Link> with 🧡
			</AdditionalText>
		</div>
	</div>
	<div class="network centered w-space">
		<SocialNetworks />
	</div>
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
	}
</style>

<style lang="scss">
	@import '../global';

	.user-logo {
		height: $max-profile-logo-height;
	}

	.link {
		text-decoration-line: underline;
	}

	.with-padding {
		padding-top: $unit-quarter;
	}
</style>

<script lang="ts">
	import Tags from './Tags.svelte';
	import { labels } from '../labels';
	import type { MetaInfo } from '../../common';

	export let profile: MetaInfo = {
		author: null,
		date: null,
		description: null,
		image: null,
		logo: null,
		publisher: null,
		title: null,
		url: null
	};

	const getImage = (data: MetaInfo): string | undefined => {
		if (data.image) {
			return data.image;
		}
	};
</script>

<div class="flex-container">
	<div class="padded-block">
		<img src="{getImage(profile)}" alt="Sergey's face" class="user-logo" />
	</div>
	<div class="padded-block">
		<div><span class="mdc-typography--headline4">{labels.name}</span></div>
		<div>
			<span class="mdc-typography--subtitle1">
				I am working at
				<a class="link" href="https://setronica.com" target="_blank"> Setronica.com </a>
			</span>
		</div>
		<div>
			<div class="mdc-typography--subtitle1">
				My specialization is everything related to
				<b>Frontend</b>
				and
				<b>NodeJS</b>
				development
			</div>
		</div>
		<div class="with-padding">
			<div class="mdc-typography--subtitle2">
				These tags are very small piece of Javascript technologies I have experience with:
			</div>
		</div>
		<div>
			<Tags />
		</div>
	</div>
</div>

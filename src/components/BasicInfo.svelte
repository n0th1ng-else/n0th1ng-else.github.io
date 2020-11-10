<style lang="scss">
	@import '../global';

	.user-logo {
		object-fit: cover;
		border-radius: 50%;

		&.user-logo-big {
			height: $max-profile-logo-height-big;
		}

		&.user-logo-small {
			height: $max-profile-logo-height-small;
			margin-right: $unit;
		}
	}

	.link {
		text-decoration-line: underline;
	}

	.with-padding {
		margin: $unit-quarter;
	}

	.aligned-with-tags {
		margin-left: $unit-half;
	}

	.hide-desktop-only {
		display: block;
	}

	.show-desktop-only {
		display: none;
	}

	@media (min-width: $max-content-width-full) {
		.hide-desktop-only {
			display: none;
		}

		.show-desktop-only {
			display: block;
		}
	}
</style>

<script lang="ts">
	import Tags from './Tags.svelte';
	import { labels } from '../labels';
	import type { MetaInfo } from '../../common';
	import { tags } from '../data/tags';

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
	<div class="with-padding show-desktop-only">
		<img src="{getImage(profile)}" alt="Sergey's face" class="user-logo user-logo-big" />
	</div>
	<div class="with-padding">
		<div class="flex-container aligned-with-tags">
			<div class="with-padding hide-desktop-only">
				<img src="{getImage(profile)}" alt="Sergey's face" class="user-logo user-logo-small" />
			</div>
			<div>
				<div><span class="mdc-typography--headline4">{labels.name}</span></div>
				<div>
					<span class="mdc-typography--subtitle1">
						I am currently working at
						<a class="link" href="https://setronica.com" target="_blank">Setronica.com</a>
					</span>
				</div>
			</div>
		</div>
		<div class="aligned-with-tags">
			<div class="mdc-typography--subtitle1">
				My specialization is everything related to
				<b>Frontend</b>
				and
				<b>NodeJS</b>
				development
			</div>
		</div>
		<div class="aligned-with-tags">
			<div class="mdc-typography--subtitle2">
				These tags are very small piece of Javascript technologies I have experience with:
			</div>
		</div>
		<div>
			<Tags items="{tags}" />
		</div>
	</div>
</div>

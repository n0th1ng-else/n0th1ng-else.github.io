<script lang="ts">
	import Tags from './Tags.svelte';
	import Link from './Link.svelte';
	import type { MetaInfo } from '../../common';
	import { labels } from '../labels';
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
		if (!data.image) {
			return;
		}

		return data.image;
	};
</script>

<div class="flex-container">
	<div class="with-padding show-desktop-only">
		<img src="{getImage(profile)}" alt="Sergey's face" class="author-avatar author-avatar--big" />
	</div>
	<div class="with-padding">
		<div class="flex-container aligned-with-tags">
			<div class="with-padding hide-desktop-only">
				<img
					src="{getImage(profile)}"
					alt="Sergey's face"
					class="author-avatar author-avatar--small"
				/>
			</div>
			<div>
				<div><span class="mdc-typography--headline4">{labels.name}</span></div>
				<div>
					<span class="mdc-typography--subtitle1">
						I am currently working at
						<Link href="https://catawiki.com" decorate>Catawiki.com</Link>
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

<style lang="scss">
	@import '../global';

	.author-avatar {
		object-fit: cover;
		border-radius: 50%;

		&--big {
			height: $max-profile-logo-height-big;
		}

		&--small {
			height: $max-profile-logo-height-small;
			margin-right: $unit;
		}
	}

	.with-padding {
		margin: $unit-quarter;
	}

	.aligned-with-tags {
		margin-left: $unit-half;
	}
</style>

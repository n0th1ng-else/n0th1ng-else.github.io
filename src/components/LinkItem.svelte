<style lang="scss">
	@import '../global';

	.flex-with-space {
		flex: 1 1 auto;
		justify-content: flex-end;
		font-size: $unit;
	}

	.pub-image {
		width: $max-article-logo-height;
	}

	.publication-card {
		margin: $unit-half $unit-half $unit-double $unit-half;
	}

	.with-space {
		margin-left: $unit-half;
	}
</style>

<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import type { LinkInfo } from '../../common';
	import { onMount, onDestroy } from 'svelte';
	import { getRelativeDate } from '../helpers/date';

	export let publication: LinkInfo = {
		service: '',
		url: '',
		lang: '',
		fullUrl: '',
		meta: {
			author: null,
			date: null,
			description: null,
			image: null,
			logo: null,
			publisher: null,
			title: null,
			url: null
		}
	};

	let pubDate: string | undefined;
	let updater: number = 0;

	const setDate = (): void => {
		pubDate = getRelativeDate(publication.meta.date);
	};

	const getImage = (data: LinkInfo): string | undefined => {
		if (data.meta.image) {
			return data.meta.image;
		}
	};

	onMount(() => {
		setDate();
		updater = window.setInterval(() => setDate(), 1000);
	});

	onDestroy(() => {
		if (updater) {
			window.clearInterval(updater);
		}
	});
</script>

<div class="publication-card">
	<Paper elevation="3">
		<Title>
			<div class="flex-container">
				<div>
					<a href="{publication.fullUrl}" target="_blank" rel="noreferrer noopener">
						<span class="mdc-typography--headline5">{publication.meta.title}</span>
					</a>
				</div>
				<div class="flex-container flex-with-space greyed">
					<div>{pubDate}</div>
				</div>
			</div>
		</Title>
		<Content>
			<div class="flex-container">
				<div><img class="pub-image" src="{getImage(publication)}" alt="publication logo" /></div>
				<div class="with-space">
					<a href="{publication.fullUrl}" target="_blank" rel="noreferrer noopener">
						<span class="mdc-typography--body1">{publication.meta.description}</span>
						<i class="fas fa-external-link-alt"></i>
					</a>
				</div>
			</div>
		</Content>
	</Paper>
</div>

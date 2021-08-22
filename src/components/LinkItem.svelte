<style lang="scss">
	@import '../global';

	.header__container {
		justify-content: space-between;

		.header__issue-date {
			flex: 1 0 auto;
			font-size: $font-size;
		}

		.header__title {
			flex: 1 1 100%;
		}
	}

	.article__content {
		margin: $unit-half $unit-half $unit-double $unit-half;

		.article__image {
			width: $max-article-logo-height;
		}

		.article__description {
			margin-left: $unit-half;
			position: relative;
		}

		.article__show-more {
			position: absolute;
			font-size: $font-size;
			margin: $unit-quarter 0 0 $unit-quarter;
		}
	}
</style>

<script lang="ts">
	import Paper, { Title, Content } from '@smui/paper';
	import Link from './Link.svelte';
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
		if (!data.meta.image) {
			return;
		}

		return data.meta.image;
	};

	onMount(() => {
		setDate();
		updater = window.setInterval(() => setDate(), 1000);
	});

	onDestroy(() => {
		if (!updater) {
			return;
		}
		window.clearInterval(updater);
	});
</script>

<div class="article__content">
	<Paper elevation="3">
		<Title>
			<div class="flex-container header__container">
				<div class="header__title">
					<div>
						<Link href="{publication.fullUrl}">
							<span class="mdc-typography--headline5">{publication.meta.title}</span>
						</Link>
					</div>
					<div class="greyed hide-desktop-only mdc-typography--caption"><span>{pubDate}</span></div>
				</div>
				<div class="header__issue-date greyed show-desktop-only"><span>{pubDate}</span></div>
			</div>
		</Title>
		<Content>
			<div class="flex-container">
				<div>
					<img class="article__image" src="{getImage(publication)}" alt="publication logo" />
				</div>
				<div class="article__description">
					<Link href="{publication.fullUrl}">
						<span class="mdc-typography--body1">{publication.meta.description}</span>
						<i class="article__show-more material-icons">launch</i>
					</Link>
				</div>
			</div>
		</Content>
	</Paper>
</div>

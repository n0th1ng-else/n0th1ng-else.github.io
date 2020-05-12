<style>
	.flex-with-space {
		flex: 1 1 auto;
		justify-content: flex-end;
		font-size: 1rem;
	}

	.pub-image {
		width: 100px;
	}

	.publication-card {
		margin: 10px;
	}

	.with-space {
		margin-left: 10px;
	}
</style>

<script>
	import { onMount, onDestroy } from 'svelte';
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import { formatDistance } from 'date-fns';

	export let publication = { meta: {} };

	let pubDate;
	let updater;

	onMount(() => {
		setDate();
		updater = setInterval(() => setDate(), 1000);
	});

	onDestroy(() => {
		if (updater) {
			clearInterval(updater);
		}
	});

	function setDate() {
		pubDate =
			publication.meta.date &&
			formatDistance(new Date(publication.meta.date), new Date(), { addSuffix: true });
	}
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
				<div>
					<img class="pub-image" src="{publication.meta.image}" alt="publication logo" />
				</div>
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

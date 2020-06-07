<style>
	.user-logo {
		height: 200px;
	}

	.link {
		text-decoration-line: underline;
	}

	.with-padding {
		padding-top: 5px;
	}
</style>

<script>
	import { labels } from '../labels';
	import Tags from './Tags.svelte';

	export let profile = {};
</script>

<div class="flex-container">
	<div class="padded-block">
		<img src="{profile.image}" alt="Sergey's face" class="user-logo" />
	</div>
	<div class="padded-block">
		<div>
			<span class="mdc-typography--headline4">{labels.name}</span>
		</div>
		<div>
			<span class="mdc-typography--subtitle1">
				I am working at
				<a class="link" href="https://setronica.com" target="_blank" referrerpolicy="no-referrer">
					Setronica.com
				</a>
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

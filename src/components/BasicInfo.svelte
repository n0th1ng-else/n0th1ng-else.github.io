<style>
	.user-logo {
		height: 200px;
	}
</style>

<script>
	import Chip, { Set, Text } from '@smui/chips';
	import { labels } from '../labels';

	export let profile = {};

	const chips = [
		{
			title: 'Angular',
			icon: 'fab fa-angular'
		},
		{
			title: 'Typescript'
		},
		{
			title: 'NodeJS'
		}
	];

	let chip;
</script>

<div class="flex-container">
	<div class="padded-block">
		<img src="{profile.image}" alt="Sergey's face" class="user-logo" />
	</div>
	<div>
		<div>
			<span class="mdc-typography--headline4">{labels.name}</span>
		</div>
		<div>
			<Set chips="{chips}" let:chip>
				<Chip shouldRemoveOnTrailingIconClick="{false}">
					{#if chip.icon}
						<i class="{chip.icon}"></i>
					{/if}
					<Text>{chip.title}</Text>
				</Chip>
			</Set>
		</div>
	</div>
</div>

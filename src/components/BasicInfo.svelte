<script>
	import Chip, { Set, Icon, Text } from '@smui/chips';

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

<div>
	<idv></idv>
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

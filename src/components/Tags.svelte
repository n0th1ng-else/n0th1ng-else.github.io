<script lang="ts">
	import type { TagModel } from '../data/tags';
	import Chip, { Set, Text } from '@smui/chips';

	export let items: TagModel[] = [];

	let chip;

	const onClick = (tag: TagModel): void => {
		window.open(tag.getUrl(), '_blank');
	};
</script>

<Set chips="{items}" let:chip>
	<Chip shouldRemoveOnTrailingIconClick="{false}" on:click="{() => onClick(chip)}">
		{#if chip.icon}<i class="{chip.icon}"></i>{/if}
		<Text>{chip.title}</Text>
	</Chip>
</Set>

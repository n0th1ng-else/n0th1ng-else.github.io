<script lang="ts">
	import Chip, { Set, Text } from '@smui/chips';
	import { TagModel, tags } from '../data/tags';

	// let chip;

	const onClick = (tag: TagModel): void => {
		window.open(tag.getUrl(), '_blank');
	};
</script>

<Set chips="{tags}" let:chip>
	<Chip shouldRemoveOnTrailingIconClick="{false}" on:click="{() => onClick(chip)}">
		{#if chip.icon}<i class="{chip.icon}"></i>{/if}
		<Text>{chip.title}</Text>
	</Chip>
</Set>

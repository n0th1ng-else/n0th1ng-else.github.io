<script>
	import Chip, { Set, Text } from '@smui/chips';
	import { tags } from '../data/tags';

	let chip;

	function onClick(tag) {
		if (tag.url) {
			window.open(tag.url, '_blank');
		}
	}
</script>

<Set chips="{tags}" let:chip>
	<Chip shouldRemoveOnTrailingIconClick="{false}" on:click="{() => onClick(chip)}">
		{#if chip.icon}
			<i class="{chip.icon}"></i>
		{/if}
		<Text>{chip.title}</Text>
	</Chip>
</Set>

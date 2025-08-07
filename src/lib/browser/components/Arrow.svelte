<script lang="ts">
	import Button from '$lib/browser/ui/Button.svelte';
	import type { ArrowDirection, ArrowSize } from '$lib/browser/ui/types';

	import iconUp from '../../../assets/icons/arrow-up.svg';
	import iconLeft from '../../../assets/icons/arrow-left.svg';

	let {
		onClick,
		hint,
		type = 'up',
		size = 'xl'
	}: { onClick: VoidFunction; hint?: string; type?: ArrowDirection; size?: ArrowSize } = $props();
	const icon = type === 'up' ? iconUp : iconLeft;
</script>

<Button secondary {onClick} printVisible={false} {hint} {icon} iconOutline iconSize={size} />

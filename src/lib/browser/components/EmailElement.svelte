<script lang="ts">
	import { getEmail } from '$lib/browser/utils/links';
	import WithCopy from './WithCopy.svelte';

	const [name, host, domain] = getEmail();
	const [email] = getEmail(true);
</script>

<WithCopy text={email}>
	<span class="email-part">{name}</span> at <span class="email-part">{host}</span> dot
	<span class="email-part">{domain}</span>
</WithCopy>

<style lang="scss">
	@import '../../../global';

	.email-part {
		font-weight: $font-weight-semi;
	}
</style>

<script lang="ts">
	import WithCopy from './WithCopy.svelte';
	import { getEmail } from '../helpers/links';

	const [name, host, domain] = getEmail();
	const [email] = getEmail(true);
</script>

<WithCopy text="{email}">
	<span class="email-part">{name}</span> at <span class="email-part">{host}</span> dot
	<span class="email-part">{domain}</span>
</WithCopy>

<style lang="scss">
	@import '../global';

	.email-part {
		font-weight: $font-weight-semi;
	}
</style>

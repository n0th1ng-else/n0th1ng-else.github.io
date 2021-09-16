<script lang="ts">
	import WithCopy from './WithCopy.svelte';
	import { getEmail } from '../helpers/links';

	const [name, domain] = getEmail();

	const onCopy = () => {
		const [email] = getEmail(true);
		return email;
	};
</script>

<WithCopy onCopy="{onCopy}">
	<span>
		<span class="email-part">{name}</span> at <span class="email-part">{domain}</span>
	</span>
</WithCopy>

<style lang="scss">
	@import '../global';

	.email-part {
		font-weight: $font-weight-semi;
	}
</style>

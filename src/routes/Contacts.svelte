<style lang="scss">
	@import '../global';

	.contacts-container {
		max-width: $max-content-width;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>

<script lang="ts">
	import ContactItem from '../components/ContactItem.svelte';
	import { RoutePath } from '.';
	import { getPageTitle } from '../labels';
	import {
		getEmailContact,
		getGitHubContact,
		getHabrContact,
		getLocationContact,
		getMediumContact,
		getTwitterContact,
		getDevtoContact,
		getLinkedInContact
	} from '../helpers/contacts';

	const email = getEmailContact();
	const location = getLocationContact();
	const twitter = getTwitterContact();
	const medium = getMediumContact();
	const github = getGitHubContact();
	const habr = getHabrContact();
	const devto = getDevtoContact();
	const linkedIn = getLinkedInContact();
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Contacts)}</title>
</svelte:head>

<div>
	<div>
		<div>
			<h2>Basic Info</h2>
		</div>
		<div class="contacts-container">
			<ContactItem
				title="{location.title}"
				sub="{location.sub}"
				type="{location.type}"
				icon="{location.icon}"
			/>
			<ContactItem
				title="{email.title}"
				link="{email.link}"
				type="{email.type}"
				icon="{email.icon}"
			/>
		</div>
	</div>

	<div>
		<div>
			<h2>Networks</h2>
		</div>
		<div class="contacts-container">
			<ContactItem title="{github.title}" link="{github.link}" image="{github.image}" />
			<ContactItem title="{devto.title}" link="{devto.link}" image="{devto.image}" />
			<ContactItem title="{twitter.title}" link="{twitter.link}" image="{twitter.image}" />
			<ContactItem title="{habr.title}" link="{habr.link}" image="{habr.image}" />
			<ContactItem title="{linkedIn.title}" link="{linkedIn.link}" image="{linkedIn.image}" />
			<ContactItem title="{medium.title}" link="{medium.link}" image="{medium.image}" />
		</div>
	</div>
</div>

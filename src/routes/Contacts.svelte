<style lang="scss">
	@import '../global';

	.contacts-storage {
		max-width: $max-content-width;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>

<script lang="ts">
	import type { ProfileAccounts } from '../../common';
	import ContactItem from '../components/ContactItem.svelte';
	import { RoutePath } from '.';
	import { getPageTitle } from '../labels';
	import { getAccounts } from '../helpers/global';
	import {
		getEmailContact,
		getGitHubContact,
		getHabrContact,
		getLocationContact,
		getMediumContact,
		getTwitterContact
	} from '../helpers/contacts';

	const accounts: ProfileAccounts = getAccounts();

	const email = getEmailContact();
	const location = getLocationContact();
	const twitter = getTwitterContact();
	const medium = getMediumContact();
	const github = getGitHubContact();
	const habr = getHabrContact();
</script>

<svelte:head>
	<title>{getPageTitle(RoutePath.Contacts)}</title>
</svelte:head>

<div>
	<div>
		<div>
			<h2>Basic Info</h2>
		</div>
		<div class="contacts-storage">
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
		<div class="contacts-storage">
			<ContactItem title="{github.title}" link="{github.link}" image="{github.image}" />
			<ContactItem title="{medium.title}" link="{medium.link}" image="{medium.image}" />
			<ContactItem title="{twitter.title}" link="{twitter.link}" image="{twitter.image}" />
			<ContactItem title="{habr.title}" link="{habr.link}" image="{habr.image}" />
		</div>
	</div>
</div>

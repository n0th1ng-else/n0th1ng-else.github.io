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
	import { ContactType } from '../data/contact';
	import {
		getEmail,
		getTwitterLink,
		getMediumLink,
		getGithubLink,
		getHabrLink,
		getLinkedInLink
	} from '../helpers/links';

	const accounts: ProfileAccounts = getAccounts();

	const email: string = getEmail();
	const twitter: string = getTwitterLink(accounts.twitter);
	const medium: string = getMediumLink(accounts.medium);
	const github: string = getGithubLink(accounts.github);
	const habr: string = getHabrLink(accounts.habr);
	const linkedin: string = getLinkedInLink(accounts.linkedIn);
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
			<ContactItem title="Novosibirsk, Russia" sub="(UTC+7)" type="{ContactType.Location}" />
			<ContactItem title="Email" link="{email}" type="{ContactType.Email}" />
		</div>
	</div>

	<div>
		<div>
			<h2>Networks</h2>
		</div>
		<div class="contacts-storage">
			<ContactItem title="GitHub" link="{github}" />
			<ContactItem title="Medium" link="{medium}" />
			<ContactItem title="Twitter" link="{twitter}" />
			<!--		<ContactItem title="LinkedIn" link="{linkedin}" />-->
			<ContactItem title="Habrahabr" link="{habr}" />
		</div>
	</div>
</div>

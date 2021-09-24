<script lang="ts">
	import Title from '../ui/Title.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import Button from '../ui/Button.svelte';
	import List from '../ui/List.svelte';
	import ListItem from '../ui/ListItem.svelte';
	import EmailElement from '../components/EmailElement.svelte';
	import Link from '../ui/Link.svelte';
	import { aboutTitle as title } from '../labels';
	import { getProfile } from '../helpers/selectors';
	import { scrollToBottom } from '../helpers/scroll';
	import { getGitHubContact, getTwitterContact } from '../helpers/contacts';

	const profile = getProfile();
	const photo = profile.image;
	const github = getGitHubContact();
	const twitter = getTwitterContact();
</script>

<div>
	<Title>About Sergey</Title>
	{#if photo}
		<div class="profile__photo-container">
			<img class="profile__photo" src="{photo}" alt="" />
		</div>
	{/if}
	<p>
		Hey there, it's Sergey. I'm a software engineer from Amsterdam, The Netherlands. Originally came
		from Russia, I explore and learn everything related to the Frontend, NodeJS. These days I
		develop UI with React and write some automation tools that keep the company ecosystem
		consistently in shape. Previously, I was doing the same with Angular. If you want to know what
		was before, then it started from Perl and JQuery.
	</p>
	<p>
		In my blog, you can find some explorations and interesting cases. I mostly talk about React,
		Angular, and NodeJS. Well, sometimes it's about soft skills. Sometimes it's pretty random
		things.
	</p>

	<SubTitle>Connect</SubTitle>
	<p>
		You can contact me by email at <EmailElement /> to say hi! I always appreciate meeting new people.
		You can find all the links in the footer of each page
		<Button inline onClick="{scrollToBottom}" hint="scroll to the bottom">⬇️</Button>. Follow me and
		send me a wave 👋🏿. These are also two main networks I'm in:
	</p>
	<List>
		<ListItem>
			<Link external inline url="{github.link}">GitHub</Link>
		</ListItem>
		<ListItem>
			<Link external inline url="{twitter.link}">Twitter</Link>
		</ListItem>
	</List>

	<SubTitle>Blog</SubTitle>
	<List>
		<ListItem>Blazing fast with Svelte</ListItem>
		<ListItem>No backend, only static GitHub pages</ListItem>
		<ListItem>Tricky deployment workflow to make it working</ListItem>
		<ListItem>Baking stuff on my MacBook Pro 2020</ListItem>
	</List>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../global';
	@import '../ui/theme';

	.profile__photo-container {
		height: auto;
		margin: auto;
		width: $max-photo-size-s;

		@media (min-width: $sm) {
			width: $max-photo-size-m;
		}

		@media (min-width: $md) {
			width: $max-photo-size-l;
		}
	}

	.profile__photo {
		border-radius: $unit;
		height: 100%;
		object-fit: contain;
		width: 100%;
	}
</style>

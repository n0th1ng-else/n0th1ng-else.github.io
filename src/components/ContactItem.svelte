<script lang="ts">
	import Card, {
		ActionButtons,
		ActionIcons,
		Actions as CardActions,
		Content as CardContent
	} from '@smui/card/styled';
	import IconButton from '@smui/icon-button/styled';
	import Dialog, { Actions, Content, Title } from '@smui/dialog/styled';
	import Button, { Label } from '@smui/button/styled';
	import { ContactType } from '../data/contact';
	import { copyToClipboard } from '../helpers/clipboard';
	import { getEmailLink, getGMapsLink } from '../helpers/links';
	import { Logger } from '../helpers/log';

	const log = new Logger('ContactItem');

	export let title = '';
	export let sub = '';
	export let icon = '';
	export let image = '';
	export let link = '';
	export let type: ContactType = ContactType.Url;

	let open = false;
	let copyError: Error | null = null;

	const openLink = (contactType: ContactType, title: string, url: string): void => {
		const enrichedUrl = contactType === ContactType.Location ? getGMapsLink(title) : url;

		if (!enrichedUrl) {
			return;
		}

		const fullUrl = contactType === ContactType.Email ? getEmailLink(enrichedUrl) : enrichedUrl;
		window.open(fullUrl, '_blank');
	};

	const copyLink = (url: string): void => {
		if (!url) {
			return;
		}

		copyToClipboard(url)
			.then(() => {
				copyError = null;
				open = true;
			})
			.catch(err => {
				log.error('Unable to copy to clipboard', err);
				copyError = err;
				open = true;
			});
	};

	const closeDialog = () => {
		copyError = null;
		open = false;
	};
</script>

<div class="contact-container">
	<div class="contact-padded">
		<Card>
			<CardContent>
				{#if icon}<span class="material-icons contact-icon">{icon}</span>{/if}
				{#if image}<img src="{image}" class="contact-image" alt="{title}" />{/if}
				<span class="title-size">{title}</span>
				<sup class="sub-size mdc-typography--overline">{sub}</sup>
			</CardContent>
			<CardActions>
				<ActionButtons>
					<Button on:click="{() => openLink(type, title, link)}">
						<Label>
							{#if type === ContactType.Email}
								Write an email
							{:else if type === ContactType.Location}Show on maps{:else}Open{/if}
						</Label>
					</Button>
				</ActionButtons>
				{#if link || type === ContactType.Location}
					<ActionIcons>
						<IconButton
							class="material-icons"
							on:click="{() => copyLink(link || title)}"
							title="Copy link"
						>
							content_copy
						</IconButton>
					</ActionIcons>
				{/if}
			</CardActions>
		</Card>

		<Dialog bind:open aria-labelledby="dialog-title" aria-describedby="dialog-content">
			<Title id="dialog-title">Copied to the clipboard</Title>
			<Content id="dialog-content">
				{#if copyError}
					Ugh! Unable to copy the link...
				{:else if type === ContactType.Email}
					The email
					<b>{link || title}</b>
					has been copied to the clipboard
				{:else if type === ContactType.Location}
					The location
					<b>{link || title}</b>
					has been copied to the clipboard
				{:else}The link <b>{link || title}</b> has been copied to the clipboard{/if}
			</Content>
			<Actions>
				<Button on:click="{() => closeDialog()}">
					<Label>OK</Label>
				</Button>
			</Actions>
		</Dialog>
	</div>
</div>

<style lang="scss">
	@use 'sass:math';
	@import '../global';

	.contact-icon {
		font-size: $font-size-plus;
		position: relative;
		top: $unit-eighth;
	}
	.contact-image {
		max-height: $unit;
		filter: brightness(0%);
		margin-right: $unit-quarter;
	}

	.title-size {
		font-size: $font-size-big;
	}

	.contact-padded {
		margin: $unit-half;
	}

	.contact-container {
		flex: 1 0 100%;
	}

	@media (min-width: $max-content-width-full) {
		.contact-container {
			flex: 0 0 math.div($max-content-width, 2);
		}
	}
</style>

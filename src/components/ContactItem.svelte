<style lang="scss">
	@import '../global';

	.title-size {
		font-size: $font-size-big;
	}

	.contact-padded {
		margin: $unit-half;
	}

	.contact-container {
		flex: 1 0 100%;
	}

	@media (min-width: $max-content-width) {
		.contact-container {
			flex: 0 0 ($max-content-width / 2);
		}
	}
</style>

<script lang="ts">
	import Card, {
		ActionButtons,
		ActionIcons,
		Actions as CardActions,
		Content as CardContent
	} from '@smui/card';
	import IconButton from '@smui/icon-button';
	import Dialog, { Actions as DialogActions, Content as DialogContent, Title } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import { ContactType } from '../data/contact';
	import { copyToClipboard } from '../helpers/clipboard';
	import { getEmailLink, getGMapsLink } from '../helpers/links';

	export let title: string = '';
	export let sub: string = '';
	export let icon: string = '';
	export let image: string = '';
	export let link: string = '';
	export let type: ContactType = ContactType.Url;

	let dialog;
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
		if (!url || !dialog) {
			return;
		}

		copyToClipboard(url)
			.then(() => {
				copyError = null;
				dialog.open();
			})
			.catch(err => {
				console.error(err);
				copyError = err;
				dialog.open();
			});
	};

	const closeDialog = () => {
		copyError = null;
		dialog.close();
	};
</script>

<div class="contact-container">
	<div class="contact-padded">
		<Card>
			<CardContent>
				<span class="title-size">{title}</span>
				<sub class="sub-size mdc-typography--overline">{sub}</sub>
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

		<Dialog bind:this="{dialog}" aria-labelledby="dialog-title" aria-describedby="dialog-content">
			<Title id="dialog-title">Copied to the clipboard</Title>
			<DialogContent id="dialog-content">
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
			</DialogContent>
			<DialogActions>
				<Button on:click="{() => closeDialog()}">
					<Label>OK</Label>
				</Button>
			</DialogActions>
		</Dialog>
	</div>
</div>

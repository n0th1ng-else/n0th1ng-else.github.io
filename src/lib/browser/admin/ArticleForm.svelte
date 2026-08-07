<script lang="ts">
	import { enhance } from '$app/forms';

	type ArticleValue = {
		slug?: string;
		title?: string;
		language?: string;
		date?: string;
		description?: string | null;
		image?: string | null;
		keywords?: string;
		reposts?: string;
		bodyMd?: string;
	};

	const {
		action,
		value = {},
		submitLabel = 'Save draft'
	}: { action: string; value?: ArticleValue; submitLabel?: string } = $props();

	const slugify = (input: string): string =>
		input
			.toLowerCase()
			.replace(/['’]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');

	let slug = $state(value.slug ?? '');
	// New articles get their slug derived from the title until the slug field is edited by hand.
	let slugEdited = $state(Boolean(value.slug));

	const onTitleInput = (event: Event): void => {
		if (slugEdited) {
			return;
		}
		slug = slugify((event.currentTarget as HTMLInputElement).value);
	};
</script>

<form method="POST" {action} use:enhance class="article-form">
	<label>
		Slug
		<input name="slug" type="text" required bind:value={slug} oninput={() => (slugEdited = true)} />
	</label>
	<label>
		Title
		<input name="title" type="text" required value={value.title ?? ''} oninput={onTitleInput} />
	</label>
	<div class="article-form__row">
		<label>
			Language
			<select name="language" value={value.language ?? 'en'}>
				<option value="en">en</option>
				<option value="ru">ru</option>
			</select>
		</label>
		<label>
			Date
			<input name="date" type="date" value={value.date ?? ''} />
		</label>
	</div>
	<label>
		Description
		<textarea name="description" rows="2">{value.description ?? ''}</textarea>
	</label>
	<label>
		Image URL
		<input name="image" type="url" value={value.image ?? ''} />
	</label>
	<label>
		Keywords (comma-separated)
		<input name="keywords" type="text" value={value.keywords ?? ''} />
	</label>
	<label>
		Reposts (comma-separated)
		<input name="reposts" type="text" value={value.reposts ?? ''} />
	</label>
	<label>
		Body (markdown)
		<textarea name="bodyMd" rows="20">{value.bodyMd ?? ''}</textarea>
	</label>
	<button type="submit">{submitLabel}</button>
</form>

<style lang="scss">
	@use '../../../global' as g;

	.article-form {
		display: grid;
		gap: g.$unit-half;
		max-width: 50rem;

		label {
			display: grid;
			gap: g.$unit-eighth;
		}
	}

	.article-form__row {
		display: flex;
		gap: g.$unit;
	}
</style>

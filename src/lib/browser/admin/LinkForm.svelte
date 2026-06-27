<script lang="ts">
	import { enhance } from '$app/forms';

	type LinkValue = {
		kind?: string;
		service?: string | null;
		lang?: string;
		url?: string;
		title?: string | null;
		description?: string | null;
		image?: string | null;
		note?: string | null;
		date?: string;
		sortOrder?: number;
	};

	const {
		action,
		value = {},
		submitLabel = 'Save'
	}: { action: string; value?: LinkValue; submitLabel?: string } = $props();
</script>

<form method="POST" {action} use:enhance class="link-form">
	<label>
		Kind
		<select name="kind" value={value.kind ?? 'reading_list'}>
			<option value="reading_list">reading_list</option>
			<option value="publication">publication</option>
			<option value="package">package</option>
		</select>
	</label>
	<label>
		Language
		<select name="lang" value={value.lang ?? 'en'}>
			<option value="en">en</option>
			<option value="ru">ru</option>
		</select>
	</label>
	<label>
		URL
		<input name="url" type="url" required value={value.url ?? ''} />
	</label>
	<label>
		Title
		<input name="title" type="text" value={value.title ?? ''} />
	</label>
	<label>
		Description
		<textarea name="description" rows="2">{value.description ?? ''}</textarea>
	</label>
	<label>
		Image URL
		<input name="image" type="url" value={value.image ?? ''} />
	</label>
	<label>
		Note (your comment)
		<textarea name="note" rows="2">{value.note ?? ''}</textarea>
	</label>
	<label>
		Service
		<input name="service" type="text" value={value.service ?? ''} />
	</label>
	<label>
		Date
		<input name="date" type="date" value={value.date ?? ''} />
	</label>
	<label>
		Sort order
		<input name="sortOrder" type="number" value={value.sortOrder ?? 0} />
	</label>
	<button type="submit">{submitLabel}</button>
</form>

<style lang="scss">
	@use '../../../global' as g;

	.link-form {
		display: grid;
		gap: g.$unit-half;
		max-width: 40rem;

		label {
			display: grid;
			gap: g.$unit-eighth;
		}
	}
</style>

import { query } from '$lib/server/db';
import type { LinkKind, LinkRow } from '$lib/server/content';

export type LinkInput = {
	kind: LinkKind;
	service: string | null;
	lang: 'en' | 'ru';
	url: string;
	title: string | null;
	description: string | null;
	image: string | null;
	note: string | null;
	date: number | null;
	sortOrder: number;
};

const KINDS: LinkKind[] = ['reading_list', 'publication', 'package'];

const text = (form: FormData, key: string): string | null => {
	const value = form.get(key);
	return typeof value === 'string' && value.trim() ? value.trim() : null;
};

// Builds a LinkInput from submitted form data. The `date` field accepts a YYYY-MM-DD string
// and is stored as a millisecond timestamp (matching reading-list item semantics).
export const parseLinkForm = (form: FormData): LinkInput => {
	const kindRaw = text(form, 'kind');
	const kind: LinkKind = KINDS.includes(kindRaw as LinkKind)
		? (kindRaw as LinkKind)
		: 'reading_list';
	const dateRaw = text(form, 'date');
	const parsedDate = dateRaw ? Date.parse(dateRaw) : NaN;

	return {
		kind,
		service: text(form, 'service'),
		lang: text(form, 'lang') === 'ru' ? 'ru' : 'en',
		url: text(form, 'url') ?? '',
		title: text(form, 'title'),
		description: text(form, 'description'),
		image: text(form, 'image'),
		note: text(form, 'note'),
		date: Number.isNaN(parsedDate) ? null : parsedDate,
		sortOrder: Number(text(form, 'sortOrder') ?? '0') || 0
	};
};

export const getLinkById = async (id: string): Promise<LinkRow | undefined> => {
	const rows = await query<LinkRow>('SELECT * FROM nothing_else_blog_content.links WHERE id = $1', [
		id
	]);
	return rows[0];
};

export const createLink = async (input: LinkInput): Promise<void> => {
	await query(
		`INSERT INTO nothing_else_blog_content.links
			(kind, service, lang, url, title, description, image, note, date, sort_order)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		[
			input.kind,
			input.service,
			input.lang,
			input.url,
			input.title,
			input.description,
			input.image,
			input.note,
			input.date,
			input.sortOrder
		]
	);
};

export const updateLink = async (id: string, input: LinkInput): Promise<void> => {
	await query(
		`UPDATE nothing_else_blog_content.links SET
			kind = $2, service = $3, lang = $4, url = $5, title = $6,
			description = $7, image = $8, note = $9, date = $10, sort_order = $11, updated_at = now()
		 WHERE id = $1`,
		[
			id,
			input.kind,
			input.service,
			input.lang,
			input.url,
			input.title,
			input.description,
			input.image,
			input.note,
			input.date,
			input.sortOrder
		]
	);
};

export const deleteLink = async (id: string): Promise<void> => {
	await query('DELETE FROM nothing_else_blog_content.links WHERE id = $1', [id]);
};

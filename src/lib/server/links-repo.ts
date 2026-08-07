import { query } from '$lib/server/db';
import linkSelectByIdSql from '$lib/server/db/queries/link-select-by-id.sql?raw';
import linkInsertSql from '$lib/server/db/queries/link-insert.sql?raw';
import linkUpdateSql from '$lib/server/db/queries/link-update.sql?raw';
import linkDeleteSql from '$lib/server/db/queries/link-delete.sql?raw';
import linkToggleHiddenSql from '$lib/server/db/queries/link-toggle-hidden.sql?raw';
import type { LinkKind, LinkRow } from '$lib/server/content';

export type LinkInput = {
	kind: LinkKind;
	service: string | null;
	lang: 'en' | 'ru';
	url: string;
	link: string | null;
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
		link: text(form, 'link'),
		title: text(form, 'title'),
		description: text(form, 'description'),
		image: text(form, 'image'),
		note: text(form, 'note'),
		date: Number.isNaN(parsedDate) ? null : parsedDate,
		sortOrder: Number(text(form, 'sortOrder') ?? '0') || 0
	};
};

export const getLinkById = async (id: string): Promise<LinkRow | undefined> => {
	const rows = await query<LinkRow>(linkSelectByIdSql, [id]);
	return rows.at(0);
};

export const createLink = async (input: LinkInput): Promise<void> => {
	await query(linkInsertSql, [
		input.kind,
		input.service,
		input.lang,
		input.url,
		input.link,
		input.title,
		input.description,
		input.image,
		input.note,
		input.date,
		input.sortOrder
	]);
};

export const updateLink = async (id: string, input: LinkInput): Promise<void> => {
	await query(linkUpdateSql, [
		id,
		input.kind,
		input.service,
		input.lang,
		input.url,
		input.link,
		input.title,
		input.description,
		input.image,
		input.note,
		input.date,
		input.sortOrder
	]);
};

export const deleteLink = async (id: string): Promise<void> => {
	await query(linkDeleteSql, [id]);
};

// Flips the "draft" switch: a hidden link stays editable in the admin area but is
// removed from all public-facing pages until toggled back.
export const toggleLinkHidden = async (id: string): Promise<void> => {
	await query(linkToggleHiddenSql, [id]);
};

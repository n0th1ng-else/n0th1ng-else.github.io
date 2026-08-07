import { query } from '$lib/server/db';
import linkSelectByKindUrlSql from '$lib/server/db/queries/link-select-by-kind-url.sql?raw';
import { createLink } from '$lib/server/links-repo';
import { revalidate, type LinkRow } from '$lib/server/content';
import { getLinkInfo } from '$lib/server/meta';
import type { ReadingListItem } from '$lib/common/readingList';

// Reading-list items live in nothing_else_blog_content.links (kind = 'reading_list'); the public page reads them
// from the in-memory cache. Adding still scrapes metadata via getLinkInfo (scrape-on-add).

const toItem = (row: LinkRow): ReadingListItem => ({
	title: row.title ?? row.url,
	description: row.description ?? undefined,
	image: row.image ?? undefined,
	url: row.url,
	note: row.note ?? undefined,
	date: row.date ? Number(row.date) : row.created_at.getTime()
});

export const saveReadingList = async (url: string, note?: string): Promise<ReadingListItem> => {
	const existing = await query<LinkRow>(linkSelectByKindUrlSql, ['reading_list', url]);
	const found = existing.at(0);
	if (found) {
		return toItem(found);
	}

	const meta = await getLinkInfo(url);
	const date = Date.now();
	await createLink({
		kind: 'reading_list',
		service: null,
		lang: 'en',
		url,
		link: null,
		title: meta.title || url,
		description: meta.description || null,
		image: meta.image || null,
		note: note ?? null,
		date,
		sortOrder: 0
	});
	await revalidate();

	return {
		title: meta.title || url,
		description: meta.description || '',
		image: meta.image || '',
		url,
		note,
		date
	};
};

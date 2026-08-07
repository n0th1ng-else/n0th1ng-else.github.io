import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

// One-time migration / normalizer: import existing content (the baked meta/index.json external
// publications and packages, plus the Cloudinary reading list) into nothing_else_blog_content.links.
// Internal articles are NOT seeded here — launch reconciliation imports them from ./articles markdown.
// Re-runnable: rows are upserted by (kind, url), so re-running re-normalizes existing rows
// (and inserts new ones). NOTE: this overwrites manual admin edits on any (kind, url) it manages.
//
// Usage: pnpm seed   (requires DATABASE_HOST/USER/PASSWORD/NAME[/PORT]; CLOUDINARY_ACCOUNT optional)

const { Pool } = pg;

const rootDir = fileURLToPath(new URL('../../', import.meta.url));

type Meta = {
	title?: string;
	description?: string;
	image?: string;
	date?: string;
	url?: string;
};

type Publication = {
	internal: boolean;
	service?: string;
	lang?: 'en' | 'ru';
	fullUrl: string;
	meta: Meta;
};

type Package = {
	service?: string;
	fullUrl: string;
	link?: string;
	logo?: string;
	meta: Meta;
};

type MetaFile = {
	publications?: Publication[];
	packages?: Package[];
};

type ReadingItem = {
	title?: string;
	description?: string;
	image?: string;
	url: string;
	note?: string;
	date?: number;
};

type LinkSeed = {
	kind: 'reading_list' | 'publication' | 'package';
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

// GitHub scrapes a page title like "GitHub - owner/repo: description"; turn that into a clean
// package name (repo) and description. Non-matching titles pass through.
const normalizeGithubPackage = (
	title: string | null,
	description: string | null
): { name: string | null; description: string | null } => {
	const stripped = (title ?? '').replace(/^GitHub\s*-\s*/i, '');
	const colon = stripped.indexOf(': ');
	if (colon < 0) {
		return { name: stripped || null, description };
	}
	const repoPath = stripped.slice(0, colon);
	return {
		name: repoPath.split('/').pop() || repoPath,
		description: stripped.slice(colon + 2) || description
	};
};

// npm scrapes "<description>. Latest version: x, last published…"; keep only the description.
const normalizeNpmDescription = (description: string | null): string | null => {
	if (!description) {
		return null;
	}
	const idx = description.indexOf('Latest version:');
	return (idx >= 0 ? description.slice(0, idx) : description).trim() || null;
};

const toMs = (date?: string): number | null => {
	if (!date) {
		return null;
	}
	const parsed = Date.parse(date);
	return Number.isNaN(parsed) ? null : parsed;
};

const fetchReadingList = async (): Promise<ReadingItem[]> => {
	const account = process.env.CLOUDINARY_ACCOUNT;
	if (!account) {
		return [];
	}
	try {
		const res = await fetch(
			`https://res.cloudinary.com/${account}/raw/upload/blog/readingList.txt`
		);
		if (!res.ok) {
			return [];
		}
		return (await res.json()) as ReadingItem[];
	} catch {
		return [];
	}
};

const main = async (): Promise<void> => {
	const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT } =
		process.env;
	if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
		throw new Error('DATABASE_HOST/USER/PASSWORD/NAME are required');
	}

	const pool = new Pool({
		host: DATABASE_HOST,
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		database: DATABASE_NAME,
		port: DATABASE_PORT ? Number(DATABASE_PORT) : undefined,
		max: 1,
		ssl: { rejectUnauthorized: false }
	});

	// Ensure the schema exists so the seed is self-sufficient. SQL lives in the shared
	// query files (src/lib/server/db); this script runs outside Vite, so read them from disk.
	const readSql = (name: string): string =>
		readFileSync(`${rootDir}src/lib/server/db/${name}`, { encoding: 'utf-8' });
	await pool.query(readSql('schema.sql'));
	const linkUpdateByKindUrlSql = readSql('queries/link-update-by-kind-url.sql');
	const linkInsertSql = readSql('queries/link-insert.sql');

	const meta = JSON.parse(
		readFileSync(`${rootDir}meta/index.json`, { encoding: 'utf-8' })
	) as MetaFile;

	const rows: LinkSeed[] = [];

	for (const pub of meta.publications ?? []) {
		if (pub.internal) {
			continue; // articles come from markdown via reconciliation
		}
		rows.push({
			kind: 'publication',
			service: pub.service ?? null,
			lang: pub.lang ?? 'en',
			url: pub.fullUrl,
			link: null,
			title: pub.meta.title ?? null,
			description: pub.meta.description ?? null,
			image: pub.meta.image ?? null,
			note: null,
			date: toMs(pub.meta.date),
			sortOrder: 0
		});
	}

	// Packages have no date; preserve their resources.json order via an explicit sort_order.
	// Scraped GitHub/npm titles+descriptions are normalized to clean name/description here.
	(meta.packages ?? []).forEach((pkg, index) => {
		const rawTitle = pkg.meta.title ?? null;
		const rawDescription = pkg.meta.description ?? null;
		const { title, description } =
			pkg.service === 'github'
				? (() => {
						const normalized = normalizeGithubPackage(rawTitle, rawDescription);
						return { title: normalized.name, description: normalized.description };
					})()
				: { title: rawTitle, description: normalizeNpmDescription(rawDescription) };

		rows.push({
			kind: 'package',
			service: pkg.service ?? null,
			lang: 'en',
			url: pkg.fullUrl,
			link: pkg.link ?? null,
			title,
			description,
			image: pkg.logo ?? null,
			note: null,
			date: null,
			sortOrder: index
		});
	});

	for (const item of await fetchReadingList()) {
		rows.push({
			kind: 'reading_list',
			service: null,
			lang: 'en',
			url: item.url,
			link: null,
			title: item.title ?? null,
			description: item.description ?? null,
			image: item.image ?? null,
			note: item.note ?? null,
			date: item.date ?? null,
			sortOrder: 0
		});
	}

	let inserted = 0;
	let updated = 0;
	for (const row of rows) {
		const params = [
			row.kind,
			row.service,
			row.lang,
			row.url,
			row.link,
			row.title,
			row.description,
			row.image,
			row.note,
			row.date,
			row.sortOrder
		];

		// Upsert keyed on (kind, url): re-normalize an existing row, else insert a new one.
		const update = await pool.query(linkUpdateByKindUrlSql, params);

		if ((update.rowCount ?? 0) > 0) {
			updated += update.rowCount ?? 0;
			continue;
		}

		await pool.query(linkInsertSql, params);
		inserted += 1;
	}

	await pool.end();

	// eslint-disable-next-line no-console
	console.log(`Seeded links: ${inserted} inserted, ${updated} re-normalized (of ${rows.length}).`);
};

main().catch((err: unknown) => {
	// eslint-disable-next-line no-console
	console.error(err);
	process.exit(1);
});

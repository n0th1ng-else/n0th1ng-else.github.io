import { query } from '$lib/server/db';
import { getReadingTime, parseMarkdown } from '$lib/server/markdown';
import type { ReadingListItem } from '$lib/common/readingList';
import type {
	ExternalPublicationInfo,
	InternalPublicationInfo,
	PackageInfo,
	PublicationInfo
} from '$lib/types';

// Row shapes mirror the `nothing_else_blog_content` schema (snake_case as returned by pg).

export type LinkKind = 'reading_list' | 'publication' | 'package';

export type LinkRow = {
	id: string;
	kind: LinkKind;
	service: string | null;
	lang: 'en' | 'ru';
	url: string;
	link: string | null;
	title: string | null;
	description: string | null;
	image: string | null;
	note: string | null;
	date: string | null; // bigint -> string (pg keeps bigint as text to avoid precision loss)
	sort_order: number;
	created_at: Date;
	updated_at: Date;
};

export type ArticleStatus = 'draft' | 'published';
export type ArticleSource = 'db' | 'markdown';

export type ArticleRow = {
	id: string;
	slug: string;
	language: 'en' | 'ru';
	title: string;
	description: string | null;
	image: string | null;
	date: Date | null;
	keywords: string[];
	reposts: string[];
	body_md: string;
	status: ArticleStatus;
	source: ArticleSource;
	share_token: string | null;
	created_at: Date;
	updated_at: Date;
};

type Cache = {
	links: LinkRow[];
	articles: ArticleRow[];
	// Derived, serve-ready views (built once per load so reads stay synchronous).
	publications: PublicationInfo[];
	packages: PackageInfo[];
	readingList: ReadingListItem[];
};

const EMPTY: Cache = {
	links: [],
	articles: [],
	publications: [],
	packages: [],
	readingList: []
};

let cache: Cache | null = null;

// --- mapping: DB rows -> domain types (matches the shapes produced by the old build script) ---

const formatDate = (date: Date | null): string => {
	if (!date) {
		return '';
	}
	const yyyy = date.getFullYear();
	const mm = `${date.getMonth() + 1}`.padStart(2, '0');
	const dd = `${date.getDate()}`.padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
};

const toInternalPublication = async (row: ArticleRow): Promise<InternalPublicationInfo> => {
	const content = await parseMarkdown(row.body_md);
	return {
		id: row.slug,
		url: row.slug,
		lang: row.language,
		fullUrl: `/blog/${row.slug}`,
		draft: row.status === 'draft',
		internal: true,
		content,
		meta: {
			title: row.title,
			description: row.description ?? '',
			image: row.image ?? '',
			date: formatDate(row.date),
			keywords: row.keywords,
			readingTime: getReadingTime(row.body_md, content)
		}
	};
};

const toExternalPublication = (row: LinkRow): ExternalPublicationInfo => ({
	id: row.id,
	url: row.url,
	lang: row.lang,
	fullUrl: row.url,
	internal: false,
	draft: false,
	service: row.service ?? '',
	meta: {
		title: row.title ?? '',
		description: row.description ?? '',
		image: row.image ?? '',
		date: row.date ? new Date(Number(row.date)).toISOString() : ''
	}
});

const toPackage = (row: LinkRow): PackageInfo => ({
	id: row.id,
	service: row.service ?? '',
	fullUrl: row.url,
	url: row.url,
	link: row.link ?? undefined,
	logo: row.image ?? undefined,
	meta: {
		title: row.title ?? '',
		description: row.description ?? '',
		url: row.url
	}
});

const toReadingListItem = (row: LinkRow): ReadingListItem => ({
	title: row.title ?? row.url,
	description: row.description ?? undefined,
	image: row.image ?? undefined,
	url: row.url,
	note: row.note ?? undefined,
	date: row.date ? Number(row.date) : row.created_at.getTime()
});

// Loads everything into memory and builds the derived views. Called once at boot
// (hooks.server.ts) and again by the admin Revalidate button / on write.
export const load = async (): Promise<void> => {
	const [links, articles] = await Promise.all([
		query<LinkRow>(
			'SELECT * FROM nothing_else_blog_content.links ORDER BY sort_order ASC, date DESC NULLS LAST, created_at ASC'
		),
		query<ArticleRow>('SELECT * FROM nothing_else_blog_content.articles')
	]);

	// Drafts never enter the public publications view — they are reachable only through
	// the admin area (raw rows) and the unlisted /draft/<share_token> preview.
	const internalPublications = await Promise.all(
		articles.filter(article => article.status === 'published').map(toInternalPublication)
	);
	const externalPublications = links
		.filter(link => link.kind === 'publication')
		.map(toExternalPublication);
	const packages = links.filter(link => link.kind === 'package').map(toPackage);
	const readingList = links.filter(link => link.kind === 'reading_list').map(toReadingListItem);

	cache = {
		links,
		articles,
		publications: [...internalPublications, ...externalPublications],
		packages,
		readingList
	};
};

export const revalidate = load;

export const isLoaded = (): boolean => cache !== null;

// Degrade to empty (not throw) when unloaded, so a failed boot serves empty pages
// and the health check reports zero counts (-> 503) instead of 500s everywhere.
const current = (): Cache => cache ?? EMPTY;

// --- serve-ready getters (consumed by selectors.ts) ---

export const getPublications = (): PublicationInfo[] => current().publications;

export const getPackages = (): PackageInfo[] => current().packages;

export const getReadingList = (): ReadingListItem[] => current().readingList;

// --- raw-row getters (consumed by admin CRUD and the draft preview) ---

export const getLinkRows = (kind?: LinkKind): LinkRow[] => {
	const { links } = current();
	return kind ? links.filter(link => link.kind === kind) : links;
};

export const getArticleRows = (): ArticleRow[] => current().articles;

export const getArticleRowBySlug = (slug: string): ArticleRow | undefined =>
	current().articles.find(article => article.slug === slug);

export const getArticleRowByShareToken = (token: string): ArticleRow | undefined =>
	current().articles.find(article => article.share_token === token);

export type ContentCounts = {
	articles: number;
	packages: number;
	publications: number;
	readingList: number;
	links: number;
};

export const getCounts = (): ContentCounts => {
	const { links, articles } = current();
	return {
		articles: articles.filter(article => article.status === 'published').length,
		packages: links.filter(link => link.kind === 'package').length,
		publications: links.filter(link => link.kind === 'publication').length,
		readingList: links.filter(link => link.kind === 'reading_list').length,
		links: links.length
	};
};

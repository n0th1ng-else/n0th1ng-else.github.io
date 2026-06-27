import parseMD from 'parse-md';
import { query } from '$lib/server/db';
import { Logger } from '$lib/common/log';

const logger = new Logger('articles-sync');

// Markdown articles are the canonical source for published posts. They are bundled at build
// time via Vite's import.meta.glob (so no filesystem access / Docker COPY is needed at runtime),
// then reconciled into content.articles at boot: git always wins for published content.
const files: Record<string, string> = import.meta.glob('/articles/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

type Frontmatter = {
	title?: unknown;
	description?: unknown;
	image?: unknown;
	language?: unknown;
	date?: unknown;
	keywords?: unknown;
	reposts?: unknown;
	draft?: unknown;
};

const slugFromPath = (path: string): string => {
	const file = path.split('/').pop() ?? path;
	return file.replace(/\.md$/, '');
};

const toText = (value: unknown): string | null => {
	if (typeof value === 'string') {
		return value;
	}
	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}
	return null;
};

const toStringArray = (value: unknown): string[] =>
	Array.isArray(value) ? value.flatMap((item) => toText(item) ?? []) : [];

const toDateString = (value: unknown): string | null => {
	if (value instanceof Date) {
		return value.toISOString().slice(0, 10);
	}
	return toText(value);
};

const isValid = (fm: Frontmatter): boolean => {
	const hasLang = fm.language === 'en' || fm.language === 'ru';
	return Boolean(fm.title) && Boolean(fm.description) && Boolean(fm.date) && hasLang;
};

// Upserts every bundled markdown article by slug (markdown overrides any DB row), then prunes
// markdown-sourced rows whose file no longer exists. DB-authored drafts are left untouched.
export const reconcileArticles = async (): Promise<void> => {
	const slugs: string[] = [];

	for (const [path, raw] of Object.entries(files)) {
		const slug = slugFromPath(path);
		const { metadata, content } = parseMD(raw) as { metadata: Frontmatter; content: string };

		if (!isValid(metadata)) {
			logger.warn(`Skipping ${path}: missing required frontmatter`);
			continue;
		}

		slugs.push(slug);

		await query(
			`INSERT INTO content.articles
				(slug, language, title, description, image, date, keywords, reposts, body_md, status, source, share_token)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'markdown', NULL)
			 ON CONFLICT (slug) DO UPDATE SET
				language = EXCLUDED.language,
				title = EXCLUDED.title,
				description = EXCLUDED.description,
				image = EXCLUDED.image,
				date = EXCLUDED.date,
				keywords = EXCLUDED.keywords,
				reposts = EXCLUDED.reposts,
				body_md = EXCLUDED.body_md,
				status = EXCLUDED.status,
				source = 'markdown',
				share_token = NULL,
				updated_at = now()`,
			[
				slug,
				toText(metadata.language) ?? 'en',
				toText(metadata.title) ?? slug,
				toText(metadata.description),
				toText(metadata.image),
				toDateString(metadata.date),
				toStringArray(metadata.keywords),
				toStringArray(metadata.reposts),
				content,
				metadata.draft ? 'draft' : 'published'
			]
		);
	}

	// Remove markdown-sourced rows whose file disappeared (keep DB-authored drafts).
	await query(
		`DELETE FROM content.articles WHERE source = 'markdown' AND NOT (slug = ANY($1::text[]))`,
		[slugs]
	);

	logger.warn(`Reconciled ${slugs.length} markdown articles`);
};

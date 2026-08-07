import { randomUUID } from 'node:crypto';
import { query } from '$lib/server/db';
import articleSelectByIdSql from '$lib/server/db/queries/article-select-by-id.sql?raw';
import articleInsertDraftSql from '$lib/server/db/queries/article-insert-draft.sql?raw';
import articleUpdateSql from '$lib/server/db/queries/article-update.sql?raw';
import articleDeleteSql from '$lib/server/db/queries/article-delete.sql?raw';
import type { ArticleRow } from '$lib/server/content';

export type ArticleInput = {
	slug: string;
	language: 'en' | 'ru';
	title: string;
	description: string | null;
	image: string | null;
	date: string | null; // YYYY-MM-DD
	keywords: string[];
	reposts: string[];
	bodyMd: string;
};

const text = (form: FormData, key: string): string => {
	const value = form.get(key);
	return typeof value === 'string' ? value.trim() : '';
};

const list = (form: FormData, key: string): string[] =>
	text(form, key)
		.split(',')
		.map(item => item.trim())
		.filter(Boolean);

export const parseArticleForm = (form: FormData): ArticleInput => ({
	slug: text(form, 'slug'),
	language: text(form, 'language') === 'ru' ? 'ru' : 'en',
	title: text(form, 'title'),
	description: text(form, 'description') || null,
	image: text(form, 'image') || null,
	date: text(form, 'date') || null,
	keywords: list(form, 'keywords'),
	reposts: list(form, 'reposts'),
	bodyMd: typeof form.get('bodyMd') === 'string' ? (form.get('bodyMd') as string) : ''
});

export const getArticleById = async (id: string): Promise<ArticleRow | undefined> => {
	const rows = await query<ArticleRow>(articleSelectByIdSql, [id]);
	return rows.at(0);
};

// Creates a draft and returns its id + share token (for the unlisted preview link).
export const createDraft = async (
	input: ArticleInput
): Promise<{ id: string; shareToken: string }> => {
	const shareToken = randomUUID();
	const rows = await query<{ id: string }>(articleInsertDraftSql, [
		input.slug,
		input.language,
		input.title,
		input.description,
		input.image,
		input.date,
		input.keywords,
		input.reposts,
		input.bodyMd,
		shareToken
	]);
	const created = rows.at(0);
	if (!created) {
		throw new Error('Draft insert returned no row');
	}
	return { id: created.id, shareToken };
};

export const updateArticle = async (id: string, input: ArticleInput): Promise<void> => {
	await query(articleUpdateSql, [
		id,
		input.slug,
		input.language,
		input.title,
		input.description,
		input.image,
		input.date,
		input.keywords,
		input.reposts,
		input.bodyMd
	]);
};

export const deleteArticle = async (id: string): Promise<void> => {
	await query(articleDeleteSql, [id]);
};

const formatDate = (date: Date | null): string => {
	if (!date) {
		return '';
	}
	const yyyy = date.getFullYear();
	const mm = `${date.getMonth() + 1}`.padStart(2, '0');
	const dd = `${date.getDate()}`.padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
};

// Emits a YAML scalar, quoting only when the value would otherwise break parsing,
// so output matches the repo's mostly-unquoted frontmatter style.
const yamlScalar = (value: string): string => {
	if (value === '') {
		return '""';
	}
	if (/[:#\n"']/.test(value) || /^[\s>|@`*&!%-]/.test(value)) {
		return JSON.stringify(value);
	}
	return value;
};

// Serializes an article row to markdown matching articles/<year>/<slug>.md frontmatter.
export const buildArticleMarkdown = (article: ArticleRow): string => {
	const lines = ['---', `title: ${yamlScalar(article.title)}`];
	if (article.image) {
		lines.push(`image: ${yamlScalar(article.image)}`);
	}
	lines.push(`description: ${yamlScalar(article.description ?? '')}`);
	lines.push(`language: ${article.language}`);
	lines.push(`date: ${formatDate(article.date)}`);
	if (article.keywords.length) {
		lines.push('keywords:');
		for (const keyword of article.keywords) {
			lines.push(`  - ${yamlScalar(keyword)}`);
		}
	}
	if (article.reposts.length) {
		lines.push('reposts:');
		for (const repost of article.reposts) {
			lines.push(`  - ${yamlScalar(repost)}`);
		}
	}
	lines.push('draft: false', '---', '');
	return `${lines.join('\n')}\n${article.body_md}\n`;
};

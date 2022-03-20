import parseMD from 'parse-md';
import { resolve as resolvePath } from 'path';
import { readdirSync, readFileSync } from 'fs';

import type { LinkInfo } from '../../../common';
import type { ArticleLanguage } from '../../../common';
import { Logger } from '../log';

const logger = new Logger('articles:server');

interface InternalMetadata {
	language: ArticleLanguage;
	published: string;
	description: string;
	title: string;
	draft?: boolean;
}

interface FilesystemDescription {
	slug: string;
	location: string;
}

const isMetadata = (value: unknown): value is InternalMetadata => {
	try {
		const res =
			{}.hasOwnProperty.call(value, 'language') &&
			{}.hasOwnProperty.call(value, 'published') &&
			{}.hasOwnProperty.call(value, 'description') &&
			{}.hasOwnProperty.call(value, 'title');
		return res;
	} catch (err) {
		logger.error('Failed to check article metadata', err);
		return false;
	}
};

const readFolder = (folder: string, returnFiles = false): FilesystemDescription[] =>
	readdirSync(folder, { withFileTypes: true })
		.filter(obj => (returnFiles ? obj.isFile() : !obj.isFile()))
		.map(obj => ({
			slug: returnFiles ? obj.name.split('.').slice(0, -1).join('.') : obj.name,
			location: resolvePath(folder, obj.name)
		}));

const findAllArticles = (rootFolder = process.cwd()): FilesystemDescription[] => {
	try {
		const articlesFolder = resolvePath(rootFolder, './articles');
		const res = readFolder(articlesFolder)
			.map(folder => readFolder(folder.location, true))
			.reduce((acc, cur) => [...acc, ...cur], []);
		return res;
	} catch (err) {
		logger.error('Unable to read articles folder', err);
		return [];
	}
};

const parseArticle = (
	slug: string,
	file: string,
	showDraft: boolean,
	withContent = false
): LinkInfo | null => {
	try {
		const fileContents = readFileSync(file, 'utf8');
		const { content, metadata } = parseMD(fileContents);
		const articleContent = withContent ? { content } : {};

		if (!isMetadata(metadata)) {
			return null;
		}

		if (!showDraft && metadata.draft) {
			// do not show the article if it is not ready
			return null;
		}

		return {
			...articleContent,
			id: slug,
			service: 'blog',
			url: slug,
			lang: metadata.language,
			fullUrl: `https://nothing-else.blog/blog/${slug}`,
			internal: true,
			meta: {
				author: 'Sergey Nikitin',
				date: metadata.published,
				description: metadata.description,
				image: null,
				logo: null,
				publisher: 'nothing-else.blog',
				title: metadata.title,
				url: `https://nothing-else.blog/blog/${slug}`
			}
		};
	} catch (err) {
		logger.error(`Unable to read article ${file}`, err);
		return null;
	}
};

export const getInternalArticles = (showDraft: boolean): LinkInfo[] => {
	const files = findAllArticles();
	return files
		.map(file => parseArticle(file.slug, file.location, showDraft))
		.filter(article => article);
};

export const getInternalArticle = (slug: string, showDraft: boolean): LinkInfo | null => {
	const files = findAllArticles();
	const file = files.find(file => file.slug === slug);

	if (!file) {
		return null;
	}

	const withContent = true;
	return parseArticle(file.slug, file.location, showDraft, withContent);
};

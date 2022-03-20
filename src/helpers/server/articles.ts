import parseMD from 'parse-md';
import { resolve as resolvePath } from 'path';
import { readdirSync, readFileSync } from 'fs';

import { Logger } from '../log';
import { getUrlPrefix } from '../api';
import { getExternalArticles, getSelfUrl } from '../selectors';
import type { LinkInfo, ArticleLanguage } from '../../../common';

const logger = new Logger('articles:server');

interface InternalMetadata {
	title: string;
	description: string;
	language: ArticleLanguage;
	published: string;
	keywords: string[];
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

		if (!isMetadata(metadata)) {
			return null;
		}

		if (!showDraft && metadata.draft) {
			// do not show the article if it is not ready
			return null;
		}

		const articleContent = withContent ? { content } : {};
		const keywords =
			metadata.keywords && Array.isArray(metadata.keywords) ? { keywords: metadata.keywords } : {};

		const fullUrl = getUrlPrefix(`${getSelfUrl()}/blog/${slug}`);

		return {
			...articleContent,
			...keywords,
			id: slug,
			service: 'blog',
			url: slug,
			lang: metadata.language,
			fullUrl,
			internal: true,
			meta: {
				author: 'Sergey Nikitin',
				date: metadata.published,
				description: metadata.description,
				image: null,
				logo: null,
				publisher: 'nothing-else.blog',
				title: metadata.title,
				url: fullUrl
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

export const getAllArticles = (showDraft = false): LinkInfo[] => [
	...getExternalArticles(),
	...getInternalArticles(showDraft)
];

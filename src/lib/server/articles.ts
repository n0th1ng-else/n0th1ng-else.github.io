import { resolve as resolvePath } from 'path';
import { readdirSync } from 'fs';
import { fetchExternalArticles, getSelfUrl } from '$lib/server/selectors';
import { Logger } from '$lib/common/log';
import { getUrlPrefix } from '$lib/common/api';
import { SUPPORTED_LANGUAGES } from '$lib/common/language';
import { getReadingTime, MY_BLOG_SERVICE } from '$lib/common/articles';
import { readMarkdownFile, renderMarkdown } from '$lib/server/markdown';
import type { LinkInfo } from '$lib/common/@types/common';
import type { ArticleLanguage } from '$lib/common/language';

const logger = new Logger('articles:server');

interface InternalMetadata {
	title: string;
	description: string;
	language: ArticleLanguage;
	date: string;
	image: string;
	keywords: string[];
	draft?: boolean;
}

interface FilesystemDescription {
	slug: string;
	location: string;
}

const isMetadata = (value: unknown): value is InternalMetadata => {
	try {
		if (typeof value !== 'object' || !value) {
			return false;
		}
		const hasLang = 'language' in value && SUPPORTED_LANGUAGES.some(l => l === value.language);
		const hasTitle = 'title' in value;
		const hasDescription = 'description' in value;
		const hasPublished = 'date' in value;
		const hasMissingFields = [hasLang, hasTitle, hasDescription, hasPublished].includes(false);
		return !hasMissingFields;
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

const parseArticle = async (
	slug: string,
	file: string,
	showDraft: boolean
): Promise<LinkInfo | null> => {
	try {
		const { content, metadata } = readMarkdownFile(file);

		if (!isMetadata(metadata)) {
			return null;
		}

		if (!showDraft && metadata.draft) {
			// do not show the article if it is not ready
			return null;
		}

		const parsedContent = await renderMarkdown(content);

		const keywords =
			metadata.keywords && Array.isArray(metadata.keywords) ? { keywords: metadata.keywords } : {};

		const fullUrl = getUrlPrefix(`${getSelfUrl()}/blog/${slug}`);
		const readingTime = getReadingTime(content, parsedContent);

		return {
			...keywords,
			id: slug,
			service: MY_BLOG_SERVICE,
			url: slug,
			lang: metadata.language,
			fullUrl,
			readingTime,
			content: parsedContent,
			internal: true,
			meta: {
				author: 'Sergey Nikitin',
				date: metadata.date,
				description: metadata.description,
				image: metadata.image,
				logo: null,
				publisher: 'nothing-else.blog',
				title: metadata.title,
				url: fullUrl,
				draft: metadata.draft ?? true
			}
		};
	} catch (err) {
		logger.error(`Unable to read article ${file}`, err);
		return null;
	}
};

export const getInternalArticles = async (showDraft: boolean): Promise<LinkInfo[]> => {
	const articles: LinkInfo[] = [];
	const files = findAllArticles();
	if (!files.length) {
		return [];
	}
	do {
		const file = files.shift();
		const article = file ? await parseArticle(file.slug, file.location, showDraft) : null;
		if (article) {
			articles.push(article);
		}
	} while (files.length);
	return articles;
};

export const getInternalArticle = async (
	slug: string,
	showDraft: boolean
): Promise<LinkInfo | null> => {
	const files = findAllArticles();
	const file = files.find(file => file.slug === slug);

	if (!file) {
		return null;
	}

	return await parseArticle(file.slug, file.location, showDraft);
};

export const getAllArticles = async (showDraft = false): Promise<LinkInfo[]> => {
	const external = await fetchExternalArticles();
	const internal = await getInternalArticles(showDraft);
	return [...external, ...internal];
};

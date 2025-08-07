import { readdirSync, readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import parseMD from 'parse-md';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { Logger } from './log.ts';
import { getBaseInternalPublication, getInternalPublication } from './publication.ts';
import type { InternalPublicationInfo } from '../lib/types.ts';

const logger = new Logger('internal-links');

const WORDS_PER_MIN = 220;

const IMAGES = {
	INITIAL_PAUSE_SEC: 10,
	MINIMAL_PAUSE_SEC: 5
};

type FileLocation = {
	slug: string;
	location: string;
};

type MarkdownMetadata = {
	language: 'en' | 'ru';
	draft: boolean;
	keywords?: string[];
	date: string;
	description: string;
	image: string;
	title: string;
};

export const getReadingTime = (raw: string, parsed: string): number => {
	const handler = new Intl.Segmenter([], { granularity: 'word' });
	const segmentedText = handler.segment(raw);
	const wordsCount = [...segmentedText].filter(s => s.isWordLike).length;
	const wordsPerSec = WORDS_PER_MIN / 60;

	const imagesCount = parsed.split('mkdn-img').length - 1;
	const imagesTime = new Array(imagesCount)
		.fill(null)
		.map((_, index) => {
			const current = IMAGES.INITIAL_PAUSE_SEC - index;
			return current < IMAGES.MINIMAL_PAUSE_SEC ? IMAGES.MINIMAL_PAUSE_SEC : current;
		})
		.reduce((sum, pause) => sum + pause, 0);

	return Math.ceil(wordsCount / wordsPerSec) + imagesTime;
};

export const parseMarkdown = async (raw: string): Promise<string> => {
	const parser = new Marked();
	parser.use({
		renderer: {
			heading({ tokens, depth }) {
				const text = this.parser.parseInline(tokens);
				const level = depth;
				return `<h${level} class="mkdn-h${level}">${text}</h${level}>\n`;
			},
			paragraph({ tokens }) {
				const text = this.parser.parseInline(tokens);
				return `<p class="mkdn-p">${text}</p>\n`;
			},
			strong({ tokens }) {
				const text = this.parser.parseInline(tokens);
				return `<strong class="mkdn-bold">${text}</strong>`;
			},
			codespan({ text }) {
				return `<code class="mkdn-code">${text}</code>`;
			},
			listitem({ tokens }) {
				const text = this.parser.parseInline(tokens);
				return `<li class="mkdn-li">${text}</li>\n`;
			},
			list({ ordered, start, items }) {
				const body = items.reduce((acc, item) => `${acc}${this.listitem(item)}`, '');

				const type = ordered ? 'ol' : 'ul';
				return [
					`<${type} class="mkdn-${type}"`,
					ordered && start !== 1 ? ` start="${start}"` : '',
					`>\n${body}</${type}>\n`
				]
					.filter(Boolean)
					.join('');
			},
			image({ href, title, text }) {
				return [
					`<img class="mkdn-img" src="${href}"`,
					text && ` alt="${text}"`,
					title && ` title="${title}"`,
					'>'
				]
					.filter(Boolean)
					.join('');
			},
			link({ href, title, tokens }) {
				const text = this.parser.parseInline(tokens);
				return [
					`<a class="mkdn-link" target="_blank" href="${href}"`,
					title && ` title="${title}"`,
					`>${text}</a>`
				]
					.filter(Boolean)
					.join('');
			}
		}
	});

	parser.use(
		markedHighlight({
			langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
			highlight: (code, lang) => {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			}
		})
	);

	return parser.parse(raw);
};

const readFolder = (folder: string, returnFiles: boolean): FileLocation[] =>
	readdirSync(folder, { withFileTypes: true })
		.filter(obj => (returnFiles ? obj.isFile() : !obj.isFile()))
		.map(obj => ({
			slug: returnFiles ? obj.name.split('.').slice(0, -1).join('.') : obj.name,
			location: resolvePath(folder, obj.name)
		}));

const findArticles = (rootDir: string): FileLocation[] => {
	try {
		const articlesFolder = resolvePath(rootDir, './articles');
		const res = readFolder(articlesFolder, false)
			.map(folder => readFolder(folder.location, true))
			.reduce((acc, cur) => [...acc, ...cur], []);
		return res;
	} catch (err) {
		logger.writeError('Unable to read articles folder', err);
		return [];
	}
};

export const readMarkdownFile = (file: string) => {
	const fileContents = readFileSync(file, { encoding: 'utf-8' });
	return parseMD(fileContents);
};

const isMetadata = (value: unknown): value is MarkdownMetadata => {
	try {
		if (typeof value !== 'object' || !value) {
			return false;
		}
		const hasLang = 'language' in value && ['en', 'ru'].some(l => l === value.language);
		const hasTitle = 'title' in value;
		const hasDescription = 'description' in value;
		const hasPublished = 'date' in value;
		const hasMissingFields = [hasLang, hasTitle, hasDescription, hasPublished].includes(false);
		return !hasMissingFields;
	} catch (err) {
		logger.writeError('Failed to check article metadata', err);
		return false;
	}
};

const getPublicationInfo = async (
	slug: string,
	location: string
): Promise<InternalPublicationInfo | null> => {
	try {
		const { content, metadata } = readMarkdownFile(location);
		const parsed = await parseMarkdown(content);

		if (!isMetadata(metadata)) {
			return null;
		}

		const { language, draft, keywords, date, description, image, title } = metadata;

		const fullUrl = `/blog/${slug}`;

		const base = getBaseInternalPublication(slug, fullUrl, language, parsed, draft);

		const publication = getInternalPublication(
			base,
			{
				description,
				date,
				image,
				title,
				keywords: keywords && Array.isArray(keywords) ? keywords : [],
				readingTime: getReadingTime(content, parsed)
			},
			slug
		);

		logger.writeOutput(`${publication.id}. ${publication.meta.title}`);
		return publication;
	} catch (err) {
		logger.writeError(`Unable to read article ${slug}`, err);
		return null;
	}
};

const getPublicationsInfo = async (files: FileLocation[]): Promise<InternalPublicationInfo[]> => {
	let file: FileLocation | undefined = undefined;
	const publications: InternalPublicationInfo[] = [];

	do {
		file = files.shift();
		if (file) {
			const publication = await getPublicationInfo(file.slug, file.location);
			if (publication) {
				publications.push(publication);
			}
		}
	} while (files.length);
	return publications;
};

export const getInternalPublications = async (
	rootDir: string
): Promise<InternalPublicationInfo[]> => {
	const files = findArticles(rootDir);
	const publications = await getPublicationsInfo(files);
	return publications;
};

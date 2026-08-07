import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Pure, runtime-safe markdown rendering + reading-time estimation.
// Mirrors the renderer previously used at build time in src/ci/internal.ts so that
// articles rendered from the DB look identical to ones baked from markdown.

const WORDS_PER_MIN = 220;

const IMAGES = {
	INITIAL_PAUSE_SEC: 10,
	MINIMAL_PAUSE_SEC: 5
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

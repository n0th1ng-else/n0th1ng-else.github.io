import { readFileSync } from 'fs';
import { Marked, Renderer } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import parseMD from 'parse-md';

export const renderMarkdown = async (md: string): Promise<string> => {
	const renderer = new Renderer();
	renderer.link = (href, title, text) =>
		[
			`<a class="mkdn-link" target="_blank" href="${href}"`,
			title && ` title="${title}"`,
			`>${text}</a>`
		]
			.filter(Boolean)
			.join('');

	renderer.image = (href, title, text) =>
		[
			`<img class="mkdn-img" src="${href}"`,
			text && ` alt="${text}"`,
			title && ` title="${title}"`,
			'>'
		]
			.filter(Boolean)
			.join('');

	renderer.strong = text => `<strong class="mkdn-bold">${text}</strong>`;

	renderer.codespan = text => `<code class="mkdn-code">${text}</code>`;

	renderer.list = (body, ordered, start) => {
		const type = ordered ? 'ol' : 'ul';
		return [
			`<${type} class="mkdn-${type}"`,
			ordered && start !== 1 ? ' start="' + start + '"' : '',
			`>\n${body}</${type}>\n`
		]
			.filter(Boolean)
			.join('');
	};

	renderer.listitem = text => `<li class="mkdn-li">${text}</li>\n`;

	renderer.heading = (text, level) => `<h${level} class="mkdn-h${level}">${text}</h${level}>\n`;

	renderer.paragraph = text => `<p class="mkdn-p">${text}</p>\n`;

	const parser = new Marked({
		renderer
	});

	parser.use(
		markedHighlight({
			langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
			highlight: (code: string, lang: string): string => {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			}
		})
	);

	return parser.parse(md);
};

export const readMarkdownFile = (file: string): { content: string; metadata: unknown } => {
	const fileContents = readFileSync(file, 'utf8');
	return parseMD(fileContents);
};

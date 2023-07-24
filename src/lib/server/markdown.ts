import { marked } from 'marked';
import hljs from 'highlight.js';

export const initMarkdown = (): void => {
	marked.setOptions({
		renderer: new marked.Renderer(),
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		},
		langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
		pedantic: false,
		gfm: true,
		breaks: false,
		sanitize: false,
		smartypants: false,
		xhtml: false
	});
};

export const renderMarkdown = (md: string): string => marked(md);

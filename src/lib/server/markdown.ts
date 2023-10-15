import { Marked } from 'marked';
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';

export const renderMarkdown = async (md: string): Promise<string> => {
	const parser = new Marked(markedHighlight({
		langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
		highlight: (code, lang) => {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		},
	}))

	return parser.parse(md);
}

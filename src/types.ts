export type EmptyToVoid = () => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop: EmptyToVoid = () => {};

export interface FilePickerOptions {
	startIn: string;
	types: {
		description: string;
		accept: Record<string, string[]>;
	}[];
}

export interface FileHandleWritableStream {
	write: (text: string) => Promise<void>;
	close: () => Promise<void>;
}

export interface FileHandle {
	getFile: () => Promise<File>;
	createWritable: () => Promise<FileHandleWritableStream>;
}

export interface MarkdownFormat {
	content: string;
	title: string;
	keywords: string[];
}

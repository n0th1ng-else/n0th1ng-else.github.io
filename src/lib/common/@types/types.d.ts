import type { EmptyToVoid, FilePickerOptions, FileHandle } from '../../../types';

declare global {
	interface Window {
		newArticle: EmptyToVoid;
		showOpenFilePicker: (options?: FilePickerOptions) => Promise<FileHandle[]>;
		showSaveFilePicker: (options?: FilePickerOptions) => Promise<FileHandle>;
	}

	const gtag: (type: string, event: string, params: Record<string, string | number>) => void;
}

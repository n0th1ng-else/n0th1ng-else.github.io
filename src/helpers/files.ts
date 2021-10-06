import type { FileHandle, FilePickerOptions } from '../types';

const opts: FilePickerOptions = {
	startIn: 'documents',
	types: [
		{
			description: 'JSON article files',
			accept: {
				'application/json': ['.json']
			}
		}
	]
};

export const openFile = <D>(): Promise<D> => {
	if (!window.showOpenFilePicker) {
		return Promise.reject(new Error('Not supported'));
	}

	return window
		.showOpenFilePicker(opts)
		.then(([fileHandle]) => fileHandle.getFile())
		.then(file => file.text())
		.then(text => {
			const data = JSON.parse(text);
			return data;
		});
};

const saveContent = async <D>(data: D, fileHandle: FileHandle) => {
	const writable = await fileHandle.createWritable();
	await writable.write(JSON.stringify(data));
	await writable.close();
	return fileHandle;
};

export const saveToFile = <D>(text: D, fileHandle?: FileHandle): Promise<FileHandle> => {
	if (!window.showSaveFilePicker) {
		return Promise.reject(new Error('Not supported'));
	}

	if (fileHandle) {
		return saveContent(text, fileHandle);
	}

	return window.showSaveFilePicker(opts).then(fileHandle => saveContent(text, fileHandle));
};

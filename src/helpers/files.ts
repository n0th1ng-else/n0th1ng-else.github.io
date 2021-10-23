import type { FileHandle, FilePickerOptions } from '../types';

const jsonOptions: FilePickerOptions = {
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

const imageOptions: FilePickerOptions = {
	startIn: 'documents',
	types: []
};

const saveContent = async <D>(data: D, fileHandle: FileHandle) => {
	const writable = await fileHandle.createWritable();
	await writable.write(JSON.stringify(data));
	await writable.close();
	return fileHandle;
};

export const openJsonFile = <D>(): Promise<D> => {
	if (!window.showOpenFilePicker) {
		return Promise.reject(new Error('Not supported'));
	}

	return window
		.showOpenFilePicker(jsonOptions)
		.then(([fileHandle]) => fileHandle.getFile())
		.then(file => file.text())
		.then(text => {
			const data = JSON.parse(text);
			return data;
		});
};

export const saveJsonFile = <D>(text: D, fileHandle?: FileHandle): Promise<FileHandle> => {
	if (!window.showSaveFilePicker) {
		return Promise.reject(new Error('Not supported'));
	}

	if (fileHandle) {
		return saveContent(text, fileHandle);
	}

	return window.showSaveFilePicker(jsonOptions).then(fileHandle => saveContent(text, fileHandle));
};

export const openImageFile = (): Promise<File> => {
	if (!window.showSaveFilePicker) {
		return Promise.reject(new Error('Not supported'));
	}

	return window.showOpenFilePicker(imageOptions).then(([fileHandle]) => fileHandle.getFile());
};

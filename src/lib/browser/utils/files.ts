import type { FileHandle, FilePickerOptions } from '../../../types';

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

const saveContent = async (data: unknown, fileHandle: FileHandle) => {
	const writable = await fileHandle.createWritable();
	await writable.write(JSON.stringify(data));
	await writable.close();
	return fileHandle;
};

export const openJsonFile = async <D>(): Promise<D> => {
	const [fileHandle] = await window.showOpenFilePicker(jsonOptions);
	const file = await fileHandle.getFile();
	const text = await file.text();
	const data = JSON.parse(text);
	return data as D;
};

export const saveJsonFile = async (text: unknown, fileHandle?: FileHandle): Promise<FileHandle> => {
	if (fileHandle) {
		return saveContent(text, fileHandle);
	}

	const file = await window.showSaveFilePicker(jsonOptions);
	return await saveContent(text, file);
};

export const openImageFile = async (): Promise<File> => {
	const [fileHandle] = await window.showOpenFilePicker(imageOptions);
	return await fileHandle.getFile();
};

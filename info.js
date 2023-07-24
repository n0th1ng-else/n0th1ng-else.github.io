import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { Logger } from './log.js';

const logger = new Logger('info');

const folder = 'meta';
const file = 'index.json';

const getFullPath = () => new URL(`./${folder}/${file}`, import.meta.url);

const getFolderPath = () => new URL(`./${folder}`, import.meta.url);

export const saveMetaToFile = meta => {
	if (!existsSync(getFolderPath())) {
		mkdirSync(getFolderPath());
	}

	const filePath = getFullPath();
	const content = JSON.stringify(meta, null, 2);
	writeFileSync(filePath, `${content}\n`);
	return filePath;
};

export const readMetaFile = () => {
	if (!existsSync(getFolderPath()) || !existsSync(getFullPath())) {
		throw new Error('Could not find meta file. Make sure it exists');
	}
	const content = readFileSync(getFullPath());
	try {
		const meta = JSON.parse(content);
		return meta;
	} catch (err) {
		logger.writeWarning('Unable to parse meta file');
		return {};
	}
};

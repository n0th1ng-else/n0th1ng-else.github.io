import { existsSync, readFileSync } from 'node:fs';
import { getPathUrl, metaFileName, metaFolderName, rootDirURL } from './dirs.js';

/**
 *
 * @param rootDir {URL}
 * @returns {object}
 */
export const readMetaFile = rootDir => {
	if (!existsSync(getPathUrl(rootDir, metaFolderName))) {
		throw new Error('meta file does not exist!');
	}

	const filePath = getPathUrl(rootDir, metaFolderName, metaFileName);
	return JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }));
};

const meta = readMetaFile(rootDirURL);
const { version, versionBuild } = meta.env;

const rowLength = 80;
const borderLine = new Array(rowLength).fill('=').join('');

const wrapMessage = message => {
	const emptyLength = rowLength - message.length - 2;
	if (emptyLength < 2) {
		throw new Error('The message is too long!');
	}

	const half = Math.floor(emptyLength * 0.5);
	const left = new Array(half).fill(' ').join('');
	const right = new Array(emptyLength - half).fill(' ').join('');
	return `=${left}${message}${right}=`;
};

console.log(`
${borderLine}
${wrapMessage('starting the blog')}
${wrapMessage(`version: ${version}, build: ${versionBuild}`)}
${borderLine}
`);

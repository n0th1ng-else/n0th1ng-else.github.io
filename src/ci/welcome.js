import { readMetaFile } from './link.js';
import { rootDirURL } from './dirs.js';

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

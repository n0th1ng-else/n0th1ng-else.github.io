import { Logger } from './log.ts';

const logger = new Logger('launcher');

// Version metadata now comes from runtime env (set on the container), not the baked meta file.
const version = process.env.APP_VERSION || '0.0.0';
const versionBuild = process.env.COMMIT_HASH || 'development';

const rowLength = 80;
const borderLine = new Array(rowLength).fill('=').join('');

const wrapMessage = (message: string): string => {
	const emptyLength = rowLength - message.length - 2;
	if (emptyLength < 2) {
		throw new Error('The message is too long!');
	}

	const half = Math.floor(emptyLength * 0.5);
	const left = new Array(half).fill(' ').join('');
	const right = new Array(emptyLength - half).fill(' ').join('');
	return `=${left}${message}${right}=`;
};

logger.writeOutput(`
${borderLine}
${wrapMessage('starting the blog')}
${wrapMessage(`version: ${version}, build: ${versionBuild}`)}
${borderLine}
`);

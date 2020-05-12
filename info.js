const fs = require('fs');
const path = require('path');
const Logger = require('./log');

const logger = new Logger('info');

const folder = 'meta';
const file = 'index.json';

function getFullPath() {
	return path.resolve(__dirname, folder, file);
}

function getFolderPath() {
	return path.resolve(__dirname, folder);
}

function saveMetaToFile(meta) {
	if (!fs.existsSync(getFolderPath())) {
		fs.mkdirSync(getFolderPath());
	}

	const content = JSON.stringify(meta);
	fs.writeFileSync(getFullPath(), content);
}

function readMetaFile() {
	if (!fs.existsSync(getFolderPath()) || !fs.existsSync(getFullPath())) {
		throw new Error('Could not find meta file. Make sure it exists');
	}
	const content = fs.readFileSync(getFullPath());
	try {
		const meta = JSON.parse(content);
		return meta;
	} catch (err) {
		logger.writeWarning('Unable to parse meta file');
		return {};
	}
}

module.exports = {
	readMetaFile,
	saveMetaToFile
};

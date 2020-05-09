const fs = require('fs');

const file = 'meta.json';

function saveMetaToFile(meta) {
	const content = JSON.stringify(meta);
	fs.writeFileSync(file, content);
}

function readMetaFile() {
	if (!fs.existsSync(file)) {
		return {};
	}
	const content = fs.readFileSync(file);
	try {
		const meta = JSON.parse(content);
		return meta;
	} catch (err) {
		return {};
	}
}

module.exports = {
	readMetaFile,
	saveMetaToFile
};

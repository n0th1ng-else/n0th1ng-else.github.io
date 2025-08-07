import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';

export const rootDir = url.fileURLToPath(new URL('../../..', import.meta.url));

export const readJsonFile = <Res>(fileName: string): Res => {
	return JSON.parse(readFileContent(fileName)) as Res;
};

export const readFileContent = (fileName: string): string =>
	fs.readFileSync(fileName, { encoding: 'utf-8' });

export const doesFileExist = (dir: string, filename: string): boolean => {
	try {
		fs.accessSync(path.join(dir, filename), fs.constants.F_OK);
		return true;
	} catch {
		return false;
	}
};

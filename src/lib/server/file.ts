import path from 'path';
import fs from 'fs';
import url from 'url';

export const rootDir = url.fileURLToPath(new URL('../../..', import.meta.url));

export const readJsonFile = <Res>(fileName: string): Res => JSON.parse(readFileContent(fileName));

export const readFileContent = (fileName: string): string =>
	fs.readFileSync(fileName, { encoding: 'utf-8' });

export const doesFileExist = (dir: string, filename: string): boolean => {
	try {
		fs.accessSync(path.join(dir, filename), fs.constants.F_OK);
		return true;
	} catch (e) {
		return false;
	}
};

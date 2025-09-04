import { fileURLToPath } from 'node:url';

export const rootDirURL = new URL('../..', import.meta.url);

export const rootDir = fileURLToPath(rootDirURL);

export const externalResourcesFile = new URL('./resources.json', rootDirURL);

export const metaFolderName = 'meta';

export const metaFileName = 'index.json';

export const getPathUrl = (rootDir: URL, folder: string, file?: string): URL => {
	if (file) {
		return new URL(`./${folder}/${file}`, rootDir);
	}
	return new URL(`./${folder}`, rootDir);
};

import { fileURLToPath } from 'node:url';

export const rootDirURL = new URL('../..', import.meta.url);

export const rootDir = fileURLToPath(rootDirURL);

export const externalResourcesFile = new URL('./resources.json', rootDirURL);

export const metaFolderName = 'meta';

export const metaFileName = 'index.json';

/**
 *
 * @param rootDir {URL}
 * @param folder {string}
 * @param [file] {string|undefined}
 *
 * @returns {URL}
 */
export const getPathUrl = (rootDir, folder, file) => {
	if (file) {
		return new URL(`./${folder}/${file}`, rootDir);
	}
	return new URL(`./${folder}`, rootDir);
};

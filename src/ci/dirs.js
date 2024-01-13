import { fileURLToPath } from 'node:url';

export const rootDirURL = new URL('../..', import.meta.url);

export const rootDir = fileURLToPath(rootDirURL);

export const externalResourcesFile = new URL('./resources.json', rootDirURL);

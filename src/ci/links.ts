import { readFileSync } from 'node:fs';
import { getLinkInfo } from '../lib/server/meta.ts';
import type { PublicationInfo } from '../lib/types.ts';
import { getFullLink, type ResourceFile, saveMetaToFile } from './link.ts';
import { getEnv } from './env.ts';
import { Logger } from './log.ts';
import { getExternalPublications } from './external.ts';
import { getInternalPublications } from './internal.ts';
import { getExternalPackagesInfo } from './packages.ts';
import { externalResourcesFile, rootDir, rootDirURL } from './dirs.ts';

const logger = new Logger('links');

const getPublicationsInfo = async (
	resources: ResourceFile,
	rootFolder: string
): Promise<PublicationInfo[]> => {
	const external = await getExternalPublications(resources);
	const internal = await getInternalPublications(rootFolder);
	return [...external, ...internal];
};

const getExternalResources = (): ResourceFile => {
	return JSON.parse(readFileSync(externalResourcesFile, { encoding: 'utf-8' })) as ResourceFile;
};

const getProfileInfo = async (resources: ResourceFile): Promise<{ image: string }> => {
	const userInfoUrl = getFullLink(resources, 'github');
	const info = await getLinkInfo(userInfoUrl);
	return {
		image: info.image
	};
};

const printVersion = () => {
	const env = getEnv();
	logger.writeOutput(`Detected version=${env.version} version build=${env.versionBuild}`);
};

// if (import.meta.main) {
printVersion();

const externalResources = getExternalResources();
Promise.all([
	getProfileInfo(externalResources),
	getPublicationsInfo(externalResources, rootDir),
	getExternalPackagesInfo(externalResources)
])
	.then(([profile, publications, packages]) => {
		const env = getEnv();
		const filePath = saveMetaToFile(rootDirURL, { profile, publications, packages, env });
		logger.writeOutput('Meta file is saved, location:', filePath.href);
		process.exit();
	})
	.catch((err: unknown) => {
		logger.writeError('Unable to fetch profile info', err);
		process.exit(1);
	});
// }

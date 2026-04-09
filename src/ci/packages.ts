import { randomUUID } from 'node:crypto';
import { getFullLink, type PackageFile, type ResourceFile, sleepFor } from './link.ts';
import { Logger } from './log.ts';
import { getLinkInfo } from '../lib/server/meta.ts';
import type { PackageInfo } from '../lib/types.ts';

const logger = new Logger('packages');

type BasePackageInfo = Omit<PackageInfo, 'meta'>;

const getBasePackage = (resources: ResourceFile, pack: PackageFile): BasePackageInfo => {
	const fullUrl = getFullLink(resources, pack.service, pack.url, pack.lang);
	return {
		id: randomUUID(),
		service: pack.service,
		fullUrl,
		url: pack.url,
		link: pack.link,
		logo: pack.logo
	};
};

const getPackageInfo = async (base: BasePackageInfo, retry = 0): Promise<PackageInfo> => {
	if (retry > 10) {
		return Promise.reject(new Error(`Unable to fetch metadata for ${base.fullUrl}`));
	}

	await sleepFor(retry * 1_000);
	const linkMeta = await getLinkInfo(base.fullUrl);
	const pack: PackageInfo = {
		...base,
		meta: {
			title: linkMeta.title,
			description: linkMeta.description,
			url: linkMeta.url
		}
	};
	logger.writeOutput(`${pack.id}. ${pack.meta.title}`);

	if (!pack.meta.title || !pack.meta.description) {
		logger.writeWarning(
			`Unable to fetch metadata for ${base.fullUrl}. Retrying (${retry} out of 10)`
		);
		return getPackageInfo(base, retry + 1);
	}
	return pack;
};

const getPackagesInfo = async (packages: BasePackageInfo[]): Promise<PackageInfo[]> => {
	let pckg: BasePackageInfo | undefined;
	const fullPackages: PackageInfo[] = [];

	do {
		pckg = packages.shift();
		if (pckg) {
			const fullInfo = await getPackageInfo(pckg);
			fullPackages.push(fullInfo);
		}
	} while (packages.length);

	return fullPackages;
};

export const getExternalPackagesInfo = async (resources: ResourceFile): Promise<PackageInfo[]> => {
	const packagesMeta = resources.packages.map(pack => getBasePackage(resources, pack));
	return getPackagesInfo(packagesMeta);
};

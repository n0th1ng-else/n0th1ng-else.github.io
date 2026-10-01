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

const getNpmPackageInfo = async (base: BasePackageInfo): Promise<PackageInfo> => {
	// www.npmjs.com is behind Cloudflare challenge ("Just a moment...") and
	// returns 403 for any non-browser fetch, so use the public registry API instead.
	const res = await fetch(`https://registry.npmjs.org/${base.url}/latest`);
	if (!res.ok) {
		throw new Error(`Failed to fetch npm metadata for ${base.fullUrl}: ${res.status}`);
	}
	const data = (await res.json()) as { name?: string; description?: string };
	const pack: PackageInfo = {
		...base,
		meta: {
			title: data.name || base.url,
			description: data.description || '',
			url: base.fullUrl
		}
	};
	logger.writeOutput(`${pack.id}. ${pack.meta.title}`);
	return pack;
};

const getPackageInfo = async (base: BasePackageInfo, retry = 0): Promise<PackageInfo> => {
	if (base.service === 'npm') {
		return getNpmPackageInfo(base);
	}

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
	let pckg: BasePackageInfo | undefined = undefined;
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

import { Logger } from './log.ts';
import {
	type BaseExternalPublicationInfo,
	getBaseExternalPublication,
	getExternalPublication
} from './publication.ts';
import { getFullLink, type ResourceFile, sleepFor } from './link.ts';
import { getLinkInfo } from '../lib/server/meta.ts';
import type { ExternalPublicationInfo } from '../lib/types.ts';

const logger = new Logger('external-links');

const getPublicationInfo = async (
	base: BaseExternalPublicationInfo,
	retry = 0
): Promise<ExternalPublicationInfo> => {
	if (retry > 10) {
		return Promise.reject(new Error(`Unable to fetch metadata for ${base.fullUrl}`));
	}

	await sleepFor(retry * 1_000);
	const meta = await getLinkInfo(base.fullUrl);

	const pub = getExternalPublication(base, {
		description: meta.description,
		date: meta.date,
		image: meta.image,
		title: meta.title
	});
	logger.writeOutput(`${pub.id}. ${pub.meta.title}`);

	if (!pub.meta.title || !pub.meta.description) {
		logger.writeWarning(
			`Unable to fetch metadata for ${pub.fullUrl}. Retrying (${retry} out of 10)`
		);
		return getPublicationInfo(base, retry + 1);
	}

	return pub;
};

const getPublicationsInfo = async (
	publications: BaseExternalPublicationInfo[]
): Promise<ExternalPublicationInfo[]> => {
	let publication: BaseExternalPublicationInfo | undefined = undefined;
	const all: ExternalPublicationInfo[] = [];

	do {
		publication = publications.shift();
		if (publication) {
			const full = await getPublicationInfo(publication);
			all.push(full);
		}
	} while (publications.length);
	return all;
};

export const getExternalPublications = async (
	resources: ResourceFile
): Promise<ExternalPublicationInfo[]> => {
	const publications = resources.publications.map(pub => {
		const url = getFullLink(resources, pub.service, pub.url, pub.lang);
		return getBaseExternalPublication(pub, url);
	});

	const full = await getPublicationsInfo(publications);
	return full;
};

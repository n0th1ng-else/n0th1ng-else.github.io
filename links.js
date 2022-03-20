import { randomUUID } from 'crypto';
import slug from 'slug';
import scrapper from 'metascraper';
import sauthor from 'metascraper-author';
import sdate from 'metascraper-date';
import sdescription from 'metascraper-description';
import simage from 'metascraper-image';
import slogo from 'metascraper-logo';
import spublisher from 'metascraper-publisher';
import stitle from 'metascraper-title';
import surl from 'metascraper-url';
import fetch from 'node-fetch';
import { saveMetaToFile } from './info.js';
import { env } from './env.js';
import { Logger } from './log.js';

const metascraper = scrapper([
	sauthor(),
	sdate(),
	sdescription(),
	simage(),
	slogo(),
	spublisher(),
	stitle(),
	surl()
]);

const logger = new Logger('links');

const getLinkHtml = url => fetch(url).then(result => result.text());

const getLinkInfo = url => getLinkHtml(url).then(html => metascraper({ html, url }));

const getLoginByService = service => {
	const login = procEnv.accounts[service];
	if (!login) {
		throw new Error(`Login for ${service} not found`);
	}
	return login;
};

const getFullLink = (data, service, path = '', lang = '') => {
	const host = data.services[service].host;
	const pattern = data.services[service].pattern;
	const login = getLoginByService(service);
	if (!pattern) {
		throw new Error(`Service must have pattern (compiling ${service})`);
	}
	const url = pattern
		.replace('%h', host)
		.replace('%u', login)
		.replace('%p', path)
		.replace('%l', lang);
	return `https://${url}`;
};

class PublicationInfo {
	constructor(data, info) {
		this.id = randomUUID();
		this.service = info.service;
		this.url = info.url;
		this.lang = info.lang;
		this.link = info.link;
		this.logo = info.logo;

		this.fullUrl = getFullLink(data, this.service, this.url, this.lang);
		this.meta = null;
	}

	setMeta(meta) {
		this.meta = meta;
		this.id = slug(meta.title);
	}
}

const getPublicationInfo = (id, publication, retry = 0) => {
	if (retry > 10) {
		return Promise.reject(new Error(`Unable to fetch metadata for ${publication.fullUrl}`));
	}

	return sleepFor(retry * 1000).then(() =>
		getLinkInfo(publication.fullUrl).then(meta => {
			publication.setMeta(meta);
			logger.writeOutput(`${id} ${publication.id}. ${publication.meta.title}`);

			if (!publication.meta.title || !publication.meta.description) {
				logger.writeWarning(
					`Unable to fetch metadata for ${publication.fullUrl}. Retrying (${retry} out of 10)`
				);
				return getPublicationInfo(id, publication, retry + 1);
			}

			return publication;
		})
	);
};

const getPublicationsInfo = (publications, info = []) => {
	if (!publications.length) {
		return info;
	}

	const pub = publications.shift();
	return getPublicationInfo('publication', pub).then(meta =>
		getPublicationsInfo(publications, [...info, meta])
	);
};

const getPackagesInfo = (packages, info = []) => {
	if (!packages.length) {
		return info;
	}

	const pack = packages.shift();
	return getPublicationInfo('package', pack).then(meta =>
		getPackagesInfo(packages, [...info, meta])
	);
};

const sleepFor = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

const { procEnv, resources } = env;
const userInfoUrl = getFullLink(resources, 'github');
const publicationMeta = resources.publications.map(
	publication => new PublicationInfo(resources, publication)
);
const packagesMeta = resources.packages.map(pack => new PublicationInfo(resources, pack));

Promise.all([
	getLinkInfo(userInfoUrl),
	getPublicationsInfo(publicationMeta),
	getPackagesInfo(packagesMeta)
])
	.then(([profile, publications, packages]) => {
		saveMetaToFile({ profile, publications, packages, env: procEnv });
		logger.writeOutput('All is good');
		process.exit();
	})
	.catch(err => {
		logger.writeError('Unable to fetch profile info', err);
		process.exit(1);
	});

const https = require('https');
const crypto = require('crypto');
const { saveMetaToFile } = require('./info');
const { resources, procEnv } = require('./env');
const Logger = require('./log');
const metascraper = require('metascraper')([
	require('metascraper-author')(),
	require('metascraper-date')(),
	require('metascraper-description')(),
	require('metascraper-image')(),
	require('metascraper-logo')(),
	require('metascraper-publisher')(),
	require('metascraper-title')(),
	require('metascraper-url')()
]);

const logger = new Logger('links');

const getLinkHtml = url =>
	new Promise((resolve, reject) => {
		https.get(url, res => {
			res.setEncoding('utf8');
			let body = '';
			res.on('data', data => {
				body = body + data;
			});
			res.on('end', () => resolve(body));
			res.on('error', err => reject(err));
		});
	});

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
		this.id = crypto.randomUUID();
		this.service = info.service;
		this.url = info.url;
		this.lang = info.lang;
		this.fullUrl = getFullLink(data, this.service, this.url, this.lang);
		this.meta = null;
	}
}

const getPublicationInfo = (id, publication, retry = 0) => {
	if (retry > 10) {
		return Promise.reject(new Error(`Unable to fetch metadata for ${publication.fullUrl}`));
	}

	return sleepFor(retry * 1000).then(() =>
		getLinkInfo(publication.fullUrl).then(meta => {
			publication.meta = meta;
			logger.writeOutput(`${id} ${publication.id}. ${publication.meta.title}`);

			if (!meta.title || !meta.description) {
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

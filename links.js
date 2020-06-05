const https = require('https');
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

function getLinkHtml(url) {
	return new Promise((resolve, reject) => {
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
}

function getLinkInfo(url) {
	return getLinkHtml(url).then(html => metascraper({ html, url }));
}

function getLoginByService(service) {
	const login = procEnv.accounts[service];
	if (!login) {
		throw new Error(`Login for ${service} not found`);
	}
	return login;
}

function getFullLink(data, service, path = '', lang = '') {
	const host = data.services[service].host;
	const pattern = data.services[service].pattern;
	const login = getLoginByService(service);
	if (!pattern) {
		throw new Error(`Service must have pattern (compiling ${service})`);
	}
	return pattern.replace('%h', host).replace('%u', login).replace('%p', path).replace('%l', lang);
}

class PublicationInfo {
	constructor(data, info) {
		this.service = info.service;
		this.url = info.url;
		this.lang = info.lang;
		this.fullUrl = getFullLink(data, this.service, this.url, this.lang);
		this.meta = null;
	}
}

function getPublicationInfo(id, publication, index) {
	return getLinkInfo(publication.fullUrl).then(meta => {
		publication.meta = meta;
		logger.writeOutput(`${id} ${index + 1}. ${publication.meta.title}`);
		return publication;
	});
}

function getPublicationsInfo(publications, info = []) {
	if (!publications.length) {
		return info;
	}

	const pub = publications.shift();
	return getPublicationInfo('publication', pub, publications.length).then(meta =>
		getPublicationsInfo(publications, [...info, meta])
	);
}

function getPackagesInfo(packages, info = []) {
	if (!packages.length) {
		return info;
	}

	const pack = packages.shift();
	return getPublicationInfo('package', pack, packages.length).then(meta =>
		getPackagesInfo(packages, [...info, meta])
	);
}

const userInfoUrl = getFullLink(resources, 'github');
const publicationMeta = resources.publications.map(
	publication => new PublicationInfo(resources, publication)
);
const packagesMeta = resources.packages.map(package => new PublicationInfo(resources, package));

Promise.all([
	getLinkInfo(userInfoUrl),
	getPublicationsInfo(publicationMeta),
	getPackagesInfo(packagesMeta)
])
	.then(([profile, publications, packages]) => {
		saveMetaToFile({ profile, publications, packages });
		logger.writeOutput('All is good');
		process.exit();
	})
	.catch(err => {
		logger.writeError('Unable to fetch profile info', err);
		process.exit(1);
	});

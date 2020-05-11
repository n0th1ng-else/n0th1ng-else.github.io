const https = require('https');
const { saveMetaToFile } = require('./info');
const { resources, procEnv } = require('./env');
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

function getLinkHtml(url) {
	return new Promise((resolve, reject) => {
		https.get(url, res => {
			res.setEncoding('utf8');
			let body = '';
			res.on('data', data => {
				body = body + data;
			});
			res.on('end', () => resolve(body));
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

function getPublicationInfo(publication) {
	return getLinkInfo(publication.fullUrl).then(meta => {
		publication.meta = meta;
		console.log(publication.meta.title);
		return publication;
	});
}

function getPublicationsInfo(publications, info = []) {
	if (!publications.length) {
		return info;
	}

	const pub = publications.shift();
	return getPublicationInfo(pub).then(meta => getPublicationsInfo(publications, [...info, meta]));
}

const userInfoUrl = getFullLink(resources, 'github');
const publicationMeta = resources.publications.map(
	publication => new PublicationInfo(resources, publication)
);

Promise.all([getLinkInfo(userInfoUrl), getPublicationsInfo(publicationMeta)])
	.then(([profile, publications]) => {
		saveMetaToFile({ profile, publications });
		console.log('All is good');
		process.exit();
	})
	.catch(err => {
		console.error('Unable to fetch profile info', err);
		process.exit(1);
	});

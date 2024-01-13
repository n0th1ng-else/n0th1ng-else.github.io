import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import scrapper from 'metascraper';
import sauthor from 'metascraper-author';
import sdate from 'metascraper-date';
import sdescription from 'metascraper-description';
import simage from 'metascraper-image';
import slogo from 'metascraper-logo';
import spublisher from 'metascraper-publisher';
import stitle from 'metascraper-title';
import surl from 'metascraper-url';
import { env } from './env.js';

const folder = 'meta';
const file = 'index.json';

/**
 *
 * @param rootDir {URL}
 * @param fol {string}
 * @param [fil] {string}
 */
const getPath = (rootDir, fol, fil) => {
	if (fil) {
		return new URL(`./${fol}/${fil}`, rootDir);
	}
	return new URL(`./${fol}`, rootDir);
};

/**
 *
 * @param rootDir {URL}
 * @param meta {object}
 */
export const saveMetaToFile = (rootDir, meta) => {
	if (!existsSync(getPath(rootDir, folder))) {
		mkdirSync(getPath(rootDir, folder));
	}

	const filePath = getPath(rootDir, folder, file);
	const content = JSON.stringify(meta, null, 2);
	writeFileSync(filePath, `${content}\n`);
	return filePath;
};

/**
 *
 * @param service {string}
 */
const getLoginByService = service => {
	const login = env.accounts[service];
	if (!login) {
		throw new Error(`Login for ${service} not found`);
	}
	return login;
};

/**
 *
 * @param data {object}
 * @param data.services {Record<string, {host: string, pattern: string}>}
 * @param service {string}
 * @param path {string}
 * @param lang {string}
 */
export const getFullLink = (data, service, path = '', lang = '') => {
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

/**
 *
 * @param url {string}
 */
const getLinkHtml = url => fetch(url).then(result => result.text());

/**
 *
 * @param url {string}
 */
export const getLinkInfo = async url => getLinkHtml(url).then(html => metascraper({ html, url }));

export const sleepFor = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

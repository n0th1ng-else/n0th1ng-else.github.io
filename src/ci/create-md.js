import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import slug from 'slug';

const TEXT_STYLE = {
	grey: '\x1b[90m',
	bold: '\x1b[1m',
	reset: '\x1b[0m'
};

/**
 *
 * @returns {string}
 */
const getArticleNameFromArgs = () => {
	const parts = process.argv.slice(2);
	if (!parts.length) {
		return '';
	}
	const title = parts.join(' ');
	return title;
};

/**
 *
 * @returns {Promise<string>}
 */
const getArticleNameFromInout = () => {
	return new Promise(resolve => {
		const readline = createInterface({
			input: process.stdin,
			output: process.stdout
		});
		readline.question(
			`${TEXT_STYLE.bold}${TEXT_STYLE.grey}What will the the article title? ${TEXT_STYLE.reset}`,
			title => {
				resolve(title);
				readline.close();
			}
		);
	});
};

const rawName = getArticleNameFromArgs() || (await getArticleNameFromInout());

const filename = slug(rawName);
const year = new Date().getFullYear();

const sample = `
---
title: This is a test
description: Once upon a time...
language: en
date: 2022-03-19
keywords:
  - test
  - test2
reposts:
  - medium
  - dev.to
draft: true
---

# In a far far galaxy...
`.trim();

const yearFolder = new URL(`../../articles/${year}/`, import.meta.url);
const file = new URL(`${filename}.md`, yearFolder);

if (existsSync(file)) {
	throw new Error(`File ${year}/${filename}.md already exist in the file system! Aborting...`);
}

if (!existsSync(yearFolder)) {
	mkdirSync(yearFolder);
}

writeFileSync(file, `${sample}\n`);

console.log(`The file ${year}/${filename}.md has been created 👍🏿`);

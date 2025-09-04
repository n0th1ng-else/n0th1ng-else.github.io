import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import slug from 'slug';
import { format, getYear } from 'date-fns';
import { rootDirURL } from './dirs.ts';
import { Logger } from './log.ts';

const logger = new Logger('md-template');

const TEXT_STYLE = {
	grey: '\x1b[90m',
	bold: '\x1b[1m',
	reset: '\x1b[0m'
};

const getArticleTitleFromArgs = (): string => {
	const parts = process.argv.slice(2);
	if (!parts.length) {
		return '';
	}
	const title = parts.join(' ');
	return title;
};

const getArticleTitleFromInput = (): Promise<string> => {
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

// if (import.meta.main) {
const title = getArticleTitleFromArgs() || (await getArticleTitleFromInput());

const filename = slug(title);
const year = getYear(new Date());
const date = format(new Date(), 'yyyy-MM-dd');

const sample = `
---
title: ${title}
description: Once upon a time...
language: en
date: ${date}
keywords:
  - test
  - test2
reposts:
  - medium
  - dev.to
draft: true
---

# Once upon a time...
`.trim();

const yearFolder = new URL(`./articles/${year}/`, rootDirURL);
const file = new URL(`${filename}.md`, yearFolder);

if (existsSync(file)) {
	throw new Error(`File ${year}/${filename}.md already exist in the file system! Aborting...`);
}

if (!existsSync(yearFolder)) {
	mkdirSync(yearFolder);
}

writeFileSync(file, `${sample}\n`);

logger.writeOutput(`The file ${year}/${filename}.md has been created 👍🏿`);
// }

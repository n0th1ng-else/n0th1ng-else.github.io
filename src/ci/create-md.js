import { existsSync, mkdirSync, writeFileSync } from 'fs';
import slug from 'slug';

const parts = process.argv.slice(2);

if (!parts.length) {
	throw new Error('No file name provided! Aborting...');
}

const rawName = parts.join(' ');

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

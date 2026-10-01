import scrapper from 'metascraper';
import sauthor from 'metascraper-author';
import sdate from 'metascraper-date';
import sdescription from 'metascraper-description';
import simage from 'metascraper-image';
import slogo from 'metascraper-logo';
import spublisher from 'metascraper-publisher';
import stitle from 'metascraper-title';
import surl from 'metascraper-url';
import type { LinkMeta } from '../types.ts';

/**
 * [Warning] The file is used in CI as well!!!
 */

const metaScraper = scrapper([
	sauthor(),
	sdate(),
	sdescription(),
	simage(),
	slogo(),
	spublisher(),
	stitle(),
	surl()
]);

const getLinkHtml = async (url: string): Promise<string> => {
	const result = await fetch(url, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.9'
		}
	});
	if (!result.ok) {
		throw new Error(`Failed to fetch html for ${url}`);
	}
	return result.text();
};

export const getLinkInfo = async (url: string): Promise<LinkMeta> => {
	const html = await getLinkHtml(url);
	const raw = await metaScraper({ html, url });
	return {
		title: raw.title || '',
		description: raw.description || '',
		image: raw.image || '',
		date: raw.date || '',
		url: raw.url || ''
	};
};

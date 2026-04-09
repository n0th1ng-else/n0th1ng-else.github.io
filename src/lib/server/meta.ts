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
	const headers = {
		'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'Accept-Language': 'en-US,en;q=0.5'
	};
	let result = await fetch(url, { headers });
	
	// If Cloudflare blocks us (403), fallback to a free open-source CORS proxy (allorigins) for HTML scraping
	if (!result.ok && result.status === 403 && url.includes('medium.com')) {
		console.log(`Fallback proxy used for ${url}`);
		result = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, { headers });
	}

	if (!result.ok) {
		throw new Error(`Failed to fetch html for ${url} ${result.status}`);
	}
	return await result.text();
};

export const getLinkInfo = async (url: string): Promise<LinkMeta> => {
	// Bypass Cloudflare on NPM by using the registry directly
	if (url.includes('npmjs.com/package/')) {
		const pkgName = url.split('package/')[1];
		try {
			const res = await fetch(`https://registry.npmjs.org/${pkgName}`);
			if (res.ok) {
				const data = await res.json();
				return {
					title: data.name || '',
					description: data.description || '',
					image: '',
					date: data.time?.modified || '',
					url: url
				};
			}
		} catch (e) {
			console.log(`Failed to fetch package JSON from registry.npmjs.org/${pkgName}`, e);
		}
	}

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

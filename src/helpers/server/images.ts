import { randomUUID } from 'crypto';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import { get as runGet } from 'https';
import { sqip } from 'sqip';

import { Logger } from '../log';
import { getAllArticles } from './articles';

const logger = new Logger('image-cache');

const cache: Record<string, string> = {};

const downloadImage = (url, filepath): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		runGet(url, res => {
			if (res.statusCode === 200) {
				res
					.pipe(createWriteStream(filepath))
					.on('error', reject)
					.once('close', () => resolve());
			} else {
				// Consume response data to free up memory
				res.resume();
				reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
			}
		});
	});
};

const generatePreview = (url: string): Promise<string> => {
	const imageTmp = `./img.${randomUUID()}`;
	return downloadImage(url, imageTmp)
		.then(() =>
			sqip({
				input: imageTmp,
				plugins: [
					{
						name: 'sqip-plugin-pixels',
						options: {
							width: 20,
							pixelSize: '1'
						}
					},
					'sqip-plugin-data-uri'
				]
			})
		)
		.then(res => {
			const result = Array.isArray(res) ? res.shift() : res;
			const preview = result?.metadata?.dataURIBase64 || '';
			return typeof preview === 'string' ? preview : '';
		})
		.finally(() => {
			if (existsSync(imageTmp)) {
				unlinkSync(imageTmp);
			}
		});
};

const updateCache = (url: string): Promise<void> =>
	generatePreview(url).then(
		preview => {
			cache[url] = preview;
		},
		err => {
			logger.error(`Unable to generate the image preview for ${url}`, err);
		}
	);

export const getPreview = (url?: string): string | null => {
	const preview = (url && cache[url]) || null;

	if (!preview && url) {
		updateCache(url);
	}

	return preview;
};

export const initCache = (): void => {
	const articles = getAllArticles();
	articles.forEach(article => getPreview(article.meta.image));
};

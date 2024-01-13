import { randomUUID } from 'node:crypto';
import slug from 'slug';

/**
 *
 * @param data {object}
 * @param data.url {string}
 * @param data.lang {string}
 * @param data.content {string}
 * @param [data.service] {string}
 * @param url {string}
 * @param isInternal {boolean}
 * @param isDraft {boolean}
 *
 */
export const getBasePublication = (data, url, isInternal, isDraft) => {
	const base = {
		id: randomUUID(),
		url: data.url,
		lang: data.lang,
		fullUrl: url,
		internal: isInternal,
		draft: isDraft
	};

	if (isInternal) {
		return {
			...base,
			content: data.content
		};
	}

	return {
		...base,
		service: data.service
	};
};

/**
 *
 * @param base {object}
 * @param meta {object}
 * @param [id] {string}
 *
 */
export const getPublication = (base, meta, id) => {
	return {
		...base,
		id: id ?? slug(meta.title),
		meta
	};
};

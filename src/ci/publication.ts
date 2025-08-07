import { randomUUID } from 'node:crypto';
import slug from 'slug';
import type { ExternalPublicationInfo, InternalPublicationInfo, LinkMeta } from '../lib/types.ts';
import type { PublicationFile } from './link.ts';

export type BaseExternalPublicationInfo = Omit<ExternalPublicationInfo, 'meta'>;
export type BaseInternalPublicationInfo = Omit<InternalPublicationInfo, 'meta'>;
type ExternalMeta = Omit<LinkMeta, 'url'>;
type InternalMeta = { keywords: string[]; readingTime: number } & ExternalMeta;

export const getBaseExternalPublication = (
	data: PublicationFile,
	url: string
): BaseExternalPublicationInfo => {
	return {
		id: randomUUID(),
		url: data.url,
		lang: data.lang,
		fullUrl: url,
		internal: false,
		draft: false,
		service: data.service
	};
};

export const getExternalPublication = (
	base: BaseExternalPublicationInfo,
	meta: ExternalMeta
): ExternalPublicationInfo => {
	return {
		...base,
		id: slug(meta.title),
		meta
	};
};

export const getBaseInternalPublication = (
	url: string,
	fullUrl: string,
	lang: 'en' | 'ru',
	content: string,
	isDraft: boolean
): BaseInternalPublicationInfo => {
	return {
		id: randomUUID(),
		url,
		lang,
		fullUrl,
		internal: true,
		draft: isDraft,
		content: content
	};
};

export const getInternalPublication = (
	base: BaseInternalPublicationInfo,
	meta: InternalMeta,
	id: string
): InternalPublicationInfo => {
	return {
		...base,
		id,
		meta
	};
};

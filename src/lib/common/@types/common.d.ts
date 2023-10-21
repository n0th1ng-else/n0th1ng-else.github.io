import type { ArticleLanguage } from '$lib/common/language';

type BaseLinkInfo = {
	id: string;
	service: string;
	url: string;
	lang: ArticleLanguage | string;
	fullUrl: string;
	meta: MetaInfo;
	link?: string;
	logo?: string;
	keywords?: string[];
};

type ExternalLinkInfo = {
	internal: false;
};

type InternalLinkInfo = {
	internal: true;
	content: string;
	readingTime: number;
};

export type LinkInfo = BaseLinkInfo & (ExternalLinkInfo | InternalLinkInfo);

export interface MetaInfo {
	author: string | null;
	date: string | null;
	description: string | null;
	image: string | null;
	logo: string | null;
	publisher: string | null;
	title: string | null;
	url: string | null;
	draft: boolean | null;
}

export interface ProfileAccounts {
	habr: string;
	github: string;
	linkedIn: string;
	medium: string;
	npm: string;
	telergam: string;
	twitter: string;
	devto: string;
}

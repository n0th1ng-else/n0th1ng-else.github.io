import type { ArticleLanguage } from '$lib/common/language';

type BasePublicationMeta = {
	description: string;
	date: string;
	image: string;
	title: string;
};

type BasePublicationInfo = {
	id: string;
	url: string;
	lang: ArticleLanguage | string;
	fullUrl: string;
	draft: boolean;
};

export type ExternalPublicationInfo = BasePublicationInfo & {
	internal: false;
	service: string;
	meta: BasePublicationMeta;
};

export type InternalPublicationInfo = BasePublicationInfo & {
	internal: true;
	content: string;
	meta: BasePublicationMeta & {
		keywords: string[];
		readingTime: number;
	};
};

export type PublicationInfo = InternalPublicationInfo | ExternalPublicationInfo;

export interface ProfileAccounts {
	habr: string;
	github: string;
	linkedIn: string;
	medium: string;
	npm: string;
	telegram: string;
	twitter: string;
	devto: string;
}

export type ProfileInfo = {
	image: string;
};

export type PackageInfo = {
	id: string;
	service: string;
	fullUrl: string;
	url: string;
	link: string;
	logo: string;
	meta: {
		title: string;
		description: string;
		url: string;
	};
};

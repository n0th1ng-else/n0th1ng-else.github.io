export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;

export type ArticleLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type BasePublicationMeta = {
	description?: string;
	date: string;
	image?: string;
	title?: string;
};

type BasePublicationInfo = {
	id: string;
	url: string;
	lang: ArticleLanguage;
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

export type ProfileAccounts = {
	habr: string;
	github: string;
	linkedIn: string;
	medium: string;
	npm: string;
	telegram: string;
	twitter: string;
	devto: string;
};

export type MetaEnvironment = {
	accounts: ProfileAccounts;
	mode: string;
	version: string;
	versionBuild: string;
};

export type ProfileInfo = {
	image: string;
};

type PackageInfoMeta = {
	title?: string;
	description?: string;
	url: string;
};

export type PackageInfo = {
	id: string;
	service: string;
	fullUrl: string;
	url: string;
	link?: string;
	logo?: string;
	meta: PackageInfoMeta;
};

export type MetaFile = {
	profile: ProfileInfo;
	env: MetaEnvironment;
	packages: PackageInfo[];
	publications: PublicationInfo[];
};

export type LinkMeta = {
	title: string;
	description: string;
	image: string;
	date: string;
	url: string;
};

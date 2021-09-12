export interface LinkInfo {
	id: string;
	service: string;
	url: string;
	lang: string;
	fullUrl: string;
	meta: MetaInfo;
}

export interface MetaInfo {
	author: string | null;
	date: string | null;
	description: string | null;
	image: string | null;
	logo: string | null;
	publisher: string | null;
	title: string | null;
	url: string | null;
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

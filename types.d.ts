declare const runtime: {
	env: {
		distInRoot: boolean;
		mode: string;
		accounts: {
			github?: string;
			linkedIn?: string;
			telergam?: string;
		};
	};
	meta: {
		profile: MetaInfo;
		publications: PublicationInfo[];
	};
};

interface PublicationInfo {
	service: string;
	url: string;
	lang: string;
	fullUrl: string;
	meta: MetaInfo;
}

interface MetaInfo {
	author: string | null;
	date: string | null;
	description: string | null;
	image: string | null;
	logo: string | null;
	publisher: string | null;
	title: string | null;
	url: string | null;
}

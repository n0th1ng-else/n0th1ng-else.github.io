declare const runtime: {
	env: {
		distInRoot: boolean;
		mode: string;
		accounts: {
			habr: string;
			github: string;
			linkedIn: string;
			medium: string;
			npm: string;
			telergam: string;
			twitter: string;
		};
	};
	meta: {
		profile: MetaInfo;
		publications: LinkInfo[];
		packages: LinkInfo[];
	};
};

interface LinkInfo {
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

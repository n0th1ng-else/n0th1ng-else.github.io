import type { LinkInfo, MetaInfo } from './common';

declare global {
	const runtime: {
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
}

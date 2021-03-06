import type { LinkInfo, MetaInfo, ProfileAccounts } from './common';

declare global {
	const runtime: {
		env: {
			distInRoot: boolean;
			mode: string;
			accounts: ProfileAccounts;
		};
		profile: MetaInfo;
		publications: LinkInfo[];
		packages: LinkInfo[];
	};

	const gtag: (type: string, event: string, params: Record<string, string>) => void;
}

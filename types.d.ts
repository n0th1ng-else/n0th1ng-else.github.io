import type { LinkInfo, MetaInfo, ProfileAccounts } from './common';
import type { EmptyToVoid } from './src/types';

declare global {
	interface Window {
		newArticle: EmptyToVoid;
	}

	const runtime: {
		env: {
			distInRoot: boolean;
			mode: string;
			accounts: ProfileAccounts;
			version: string;
		};
		profile: MetaInfo;
		publications: LinkInfo[];
		packages: LinkInfo[];
	};

	const gtag: (type: string, event: string, params: Record<string, string>) => void;
}

import type { LinkInfo, MetaInfo, ProfileAccounts } from './common';
import type { EmptyToVoid, FilePickerOptions, FileHandle } from './src/types';

declare global {
	interface Window {
		newArticle: EmptyToVoid;
		showOpenFilePicker: (options?: FilePickerOptions) => Promise<FileHandle[]>;
		showSaveFilePicker: (options?: FilePickerOptions) => Promise<FileHandle>;
	}

	const runtime: {
		env: {
			distInRoot: boolean;
			mode: string;
			accounts: ProfileAccounts;
			version: string;
			versionBuild: string;
		};
		profile: MetaInfo;
		publications: LinkInfo[];
		packages: LinkInfo[];
	};

	const gtag: (type: string, event: string, params: Record<string, string>) => void;
}

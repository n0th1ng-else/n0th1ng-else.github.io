import type { PackageInfo, ProfileAccounts } from '$lib/types';
import { getGithubLink } from './links';
import nssLogo from '../../../assets/images/nss-logo.svg';
import setronicaLogo from '../../../assets/images/setronica-logo.png';
import catawikiLogo from '../../../assets/images/catawiki-logo.svg';
import tradeshiftLogo from '../../../assets/images/tradeshift-logo.svg';
import miroLogo from '../../../assets/images/miro-logo.svg';

export const enum Position {
	Fullstack,
	Middle,
	Senior,
	SeniorL1
}

export interface ProjectItem {
	name: string;
	logo?: string;
	url?: string;
	source?: string;
	registry?: string;
	tags?: string[];
	description?: string;
	position?: Position;
	startDate?: string;
	endDate?: string;
}

const getNSS = (): ProjectItem => ({
	name: 'Novel Software Systems',
	logo: nssLogo,
	url: 'https://novel-soft.com',
	tags: ['Perl', 'JQuery', 'Raphael.js'],
	position: Position.Fullstack,
	startDate: '01-07-2013',
	endDate: '01-08-2016'
});

const getSetronica = (): ProjectItem => ({
	name: 'Setronica',
	logo: setronicaLogo,
	url: 'https://setronica.com',
	tags: ['React', 'Angular', 'NodeJS'],
	position: Position.Senior,
	startDate: '01-09-2016',
	endDate: '01-06-2021'
});

const getTradeshift = (): ProjectItem => ({
	name: 'Tradeshift',
	logo: tradeshiftLogo,
	url: 'https://tradeshift.com',
	tags: ['React', 'Angular', 'NodeJS'],
	position: Position.Senior,
	startDate: '01-09-2016',
	endDate: '01-06-2021'
});

const getCatawiki = (): ProjectItem => ({
	name: 'Catawiki',
	logo: catawikiLogo,
	url: 'https://www.catawiki.com',
	tags: ['React', 'k8s', 'NodeJS'],
	position: Position.SeniorL1,
	startDate: '01-07-2021',
	endDate: '31-10-2022'
});

const getMiro = (): ProjectItem => ({
	name: 'Miro',
	logo: miroLogo,
	url: 'https://www.miro.com',
	tags: ['React', 'NextJS'],
	position: Position.Senior,
	startDate: '01-11-2022'
});

export const getWorkProjects = (): ProjectItem[] => [
	getMiro(),
	getCatawiki(),
	getTradeshift(),
	getSetronica(),
	getNSS()
];

const transformPackage = (pkg: PackageInfo, accounts: ProfileAccounts): ProjectItem => {
	const github = accounts.github;
	// Title and description are stored clean (the seed normalizes scraped GitHub/npm data),
	// so the view just renders them — no slicing/substring here.
	const name = pkg.meta.title || pkg.url;
	const description = pkg.meta.description || '';

	switch (pkg.service) {
		case 'github':
			// Source button -> the repo; Website button -> the optional homepage (link column).
			return {
				name,
				source: pkg.fullUrl,
				url: pkg.link,
				description,
				logo: pkg.logo
			};
		default:
			// npm and others: Package button -> the registry; Source -> the GitHub repo.
			return {
				name,
				source: pkg.link || getGithubLink(github, name),
				registry: pkg.fullUrl,
				url: undefined,
				description,
				logo: pkg.logo
			};
	}
};

export const getPetProjects = (packages: PackageInfo[], accounts: ProfileAccounts): ProjectItem[] =>
	packages.map(pkg => transformPackage(pkg, accounts));

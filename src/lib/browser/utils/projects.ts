import type { LinkInfo, ProfileAccounts } from '$lib/common/@types/common';
import { getGithubLink } from './links';
import nssLogo from '../../../assets/images/nss-logo.png';
import setronicaLogo from '../../../assets/images/setronica-logo.png';
import catawikiLogo from '../../../assets/images/catawiki-logo.svg';
import tradeshiftLogo from '../../../assets/images/tradeshift-logo.svg';

export enum Position {
	Fullstack,
	Frontend
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
	position: Position.Frontend,
	startDate: '01-09-2016',
	endDate: '01-06-2021'
});

const getTradeshift = (): ProjectItem => ({
	name: 'Tradeshift',
	logo: tradeshiftLogo,
	url: 'https://tradeshift.com',
	tags: ['React', 'Angular', 'NodeJS'],
	position: Position.Frontend,
	startDate: '01-09-2016',
	endDate: '01-06-2021'
});

const getCatawiki = (): ProjectItem => ({
	name: 'Catawiki',
	logo: catawikiLogo,
	url: 'https://www.catawiki.com',
	tags: ['React', 'k8s', 'NodeJS'],
	position: Position.Frontend,
	startDate: '01-07-2021'
});

export const getWorkProjects = (): ProjectItem[] => [
	getCatawiki(),
	getTradeshift(),
	getSetronica(),
	getNSS()
];

const transformPackage = (pkg: LinkInfo, accounts: ProfileAccounts): ProjectItem => {
	const github = accounts.github;

	switch (pkg.service) {
		case 'github':
			return {
				name: pkg.url,
				source: pkg.meta.url || pkg.fullUrl,
				description: pkg.meta.title.substr(pkg.meta.title.indexOf(': ') + 2),
				url: pkg.link,
				logo: pkg.logo
			};
		case 'npm':
			return {
				name: pkg.meta.title || pkg.url,
				source: pkg.meta.title ? getGithubLink(github, pkg.meta.title) : undefined,
				registry: pkg.fullUrl,
				description: pkg.meta.description.slice(0, pkg.meta.description.indexOf('Latest version:'))
			};
		default:
			return {
				name: pkg.meta.title || pkg.url,
				source: pkg.meta.title ? getGithubLink(github, pkg.meta.title) : undefined,
				registry: pkg.fullUrl,
				description: pkg.meta.description
			};
	}
};

export const getPetProjects = (packages: LinkInfo[], accounts: ProfileAccounts): ProjectItem[] =>
	packages.map(pkg => transformPackage(pkg, accounts));

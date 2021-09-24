import nssLogo from '../assets/images/nss-logo.png';
import setronicaLogo from '../assets/images/setronica-logo.png';
import catawikiLogo from '../assets/images/catawiki-logo.svg';
import { getAccounts, getPackages } from './selectors';
import { getGithubLink } from './links';

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

const getCatawiki = (): ProjectItem => ({
	name: 'Catawiki',
	logo: catawikiLogo,
	url: 'https://www.catawiki.com',
	tags: ['React', 'k8s', 'NodeJS'],
	position: Position.Frontend,
	startDate: '01-07-2021'
});

export const getWorkProjects = (): ProjectItem[] => [getCatawiki(), getSetronica(), getNSS()];

export const getPetProjects = (): ProjectItem[] => {
	const accounts = getAccounts();
	const packages = getPackages();
	const github = accounts.github;

	return packages.map(pkg => ({
		name: pkg.meta.title || pkg.url,
		source: pkg.meta.title ? getGithubLink(github, pkg.meta.title) : undefined,
		registry: pkg.fullUrl,
		// tags: ['JavaScript'],
		description: pkg.meta.description ?? undefined
	}));
};

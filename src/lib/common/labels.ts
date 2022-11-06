import { Position } from '$lib/browser/utils/projects';

export const getPageTitle = (title: string): string => {
	const brand = 'Nothing Else';
	return title ? `${title} | ${brand}` : brand;
};

export const homeTitle = getPageTitle('Home');

export const blogTitle = getPageTitle('Blog');

export const projectsTitle = getPageTitle('Projects');

export const aboutTitle = getPageTitle('About');

export const legalTitle = getPageTitle('Legal Information');

export const newArticleTitle = getPageTitle('New Article');

export const notFoundTitle = getPageTitle('Page Not Found');

export const getServiceTitle = (service?: string): string => {
	if (!service) {
		return '';
	}

	return service === 'devto' ? 'dev.to' : service;
};

export const getPositionTitle = (position?: Position): string => {
	switch (position) {
		case Position.FrontendL2:
			return 'Software Engineer II';
		case Position.FrontendL1:
			return 'Senior Frontend Engineer';
		case Position.Fullstack:
			return 'FullStack Engineer';
		default:
			return '';
	}
};

import { Position } from './helpers/projects';

export const getPageTitle = (title?: string): string => {
	const brand = 'Nothing Else';
	return title ? `${title} | ${brand}` : brand;
};

export const homeTitle = getPageTitle('Home');

export const blogTitle = getPageTitle('Blog');

export const projectsTitle = getPageTitle('Projects');

export const aboutTitle = getPageTitle('About');

export const legalTitle = getPageTitle('Legal Inforamtion');

export const newArticleTitle = getPageTitle('New Article');

export const notFoundTitle = getPageTitle('Page Not Found');

export const getServiceTitle = (service?: string): string => {
	if (!service) {
		return '';
	}

	return service === 'devto' ? 'dev.to' : service;
};

export const getPositionTitle = (position?: Position) => {
	switch (position) {
		case Position.Frontend:
			return 'Senior Frontend Engineer';
		case Position.Fullstack:
			return 'FullStack Engineer';
		default:
			return '';
	}
};

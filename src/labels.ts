import { RoutePath } from './routes';

export const labels = {
	name: 'Sergey Nikitin',
	tabs: {
		[RoutePath.News]: 'News',
		[RoutePath.Contacts]: 'Contacts',
		[RoutePath.Projects]: 'Projects',
		[RoutePath.Articles]: 'Articles',
		[RoutePath.Packages]: 'Packages'
	}
};

export function getPageTitle(path: RoutePath): string {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return `${labels.name} | ${labels.tabs[path]}`;
}

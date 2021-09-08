import { RoutePath } from './routes';

export enum PageState {
	NotFound = 'not-found'
}

export const labels = {
	name: 'Sergey Nikitin',
	tabs: {
		[RoutePath.Home]: 'Home',
		[RoutePath.Blog]: 'Blog',
		[RoutePath.Projects]: 'Projects',
		[RoutePath.About]: 'About',
		[PageState.NotFound]: 'Page Not Found'
	}
};

export function getPageTitle(path: RoutePath | PageState): string {
	const title = labels.tabs[path];
	return title ? `${labels.name} | ${title}` : labels.name;
}

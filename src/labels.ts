import { RoutePath } from './routes';

export enum PageState {
	NotFound = 'not-found'
}

const labels = {
	name: 'Sergey Nikitin',
	brand: 'Nothing Else',
	tabs: {
		[RoutePath.Home]: 'Home',
		[RoutePath.Blog]: 'Blog',
		[RoutePath.Projects]: 'Projects',
		[RoutePath.About]: 'About',
		[PageState.NotFound]: 'Page Not Found'
	}
};

export function getPageTitle(path: RoutePath | PageState | string): string {
	const title = labels.tabs[path] ?? path;
	return `${title} | ${labels.brand}`;
}

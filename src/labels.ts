import { RoutePath } from './routes';

export const labels = {
	name: 'Sergey Nikitin',
	tabs: {
		[RoutePath.Chronic]: 'Chronic',
		[RoutePath.Contact]: 'Contact',
		[RoutePath.Info]: 'Info',
		[RoutePath.Publication]: 'Publications'
	}
};

export function getPageTitle(path: RoutePath): string {
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	return `${labels.name} | ${labels.tabs[path]}`;
}

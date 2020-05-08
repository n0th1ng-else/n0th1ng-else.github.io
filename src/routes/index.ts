export enum RoutePath {
	Chronic = 'chronic',
	Contact = 'contact',
	Info = 'info',
	Publication = 'publication',
	En = 'en',
	Ru = 'ru',
	Other = '*'
}

export function toPath(paths?: RoutePath | RoutePath[]): string {
	if (!paths) {
		return '/';
	}

	if (paths === RoutePath.Other) {
		return RoutePath.Other;
	}
	const path = typeof paths === 'string' ? [paths] : paths;
	return `/${path.join('/')}`;
}

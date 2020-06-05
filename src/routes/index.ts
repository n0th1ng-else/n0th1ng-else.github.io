export enum RoutePath {
	Chronic = 'chronic',
	Contact = 'contact',
	Info = 'info',
	Publication = 'publication',
	Package = 'package',
	Other = '*'
}

export function toPath(path?: RoutePath): string {
	if (!path) {
		return '/';
	}

	if (path === RoutePath.Other) {
		return RoutePath.Other;
	}

	return `/${path}`;
}

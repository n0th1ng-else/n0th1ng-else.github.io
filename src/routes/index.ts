export enum RoutePath {
	News = 'news',
	Contacts = 'contacts',
	Projects = 'projects',
	Articles = 'articles',
	Packages = 'packages',
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

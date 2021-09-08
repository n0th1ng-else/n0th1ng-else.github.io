export enum RoutePath {
	Home = '',
	Blog = 'blog',
	Projects = 'projects',
	About = 'about',
	Other = '*'
}

export const toPath = (path?: RoutePath): string => {
	if (!path) {
		return '/';
	}

	if (path === RoutePath.Other) {
		return RoutePath.Other;
	}

	return `/${path}`;
};

export const toArticle = (): string => `/${RoutePath.Blog}/:id`;

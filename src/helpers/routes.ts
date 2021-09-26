enum RoutePath {
	Home = '',
	Blog = 'blog',
	Projects = 'projects',
	About = 'about',
	Legal = 'legal',
	NotFound = 'not-found',
	Other = '*'
}

const toPath = (path?: RoutePath): string => {
	if (!path) {
		return '/';
	}

	if (path === RoutePath.Other) {
		return RoutePath.Other;
	}

	return `/${path}`;
};

export const homeRoute = toPath(RoutePath.Home);

export const blogRoute = toPath(RoutePath.Blog);

export const articleRoute = `${blogRoute}/:slug`;

export const newArticleRoute = `${blogRoute}/new`;

export const projectsRoute = toPath(RoutePath.Projects);

export const aboutRoute = toPath(RoutePath.About);

export const legalRoute = toPath(RoutePath.Legal);

export const notFoundRoute = toPath(RoutePath.NotFound);

export const toArticle = (id: string): string => `${blogRoute}/${id}`;

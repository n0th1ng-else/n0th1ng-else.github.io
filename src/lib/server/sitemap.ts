import type { RoutePriority } from '$lib/common/routes';

const getSitemapRoute = (host: string, route: string, priority: string): string =>
	`<url>
        <loc>${host}${route}</loc>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
    </url>`;

const getSitemapContainer = (urls: string): string =>
	`<?xml version="1.0" encoding="UTF-8" ?>
         <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
                 xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
                 xmlns:xhtml="https://www.w3.org/1999/xhtml"
                 xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
                 xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
                 xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
        >
            ${urls}
        </urlset>`;

export const generateSitemap = (url: string, routes: RoutePriority) => {
	const critical = routes.critical.map(route => getSitemapRoute(url, route, '0.9')).join('\n');
	const major = routes.major.map(route => getSitemapRoute(url, route, '0.5')).join('\n');
	const minor = routes.minor.map(route => getSitemapRoute(url, route, '0.2')).join('\n');
	const all = [critical, major, minor].join('\n');
	const container = getSitemapContainer(all);
	return container;
};

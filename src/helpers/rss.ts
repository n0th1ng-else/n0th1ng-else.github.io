import type { LinkInfo } from '../../common';
import { getAbsoluteArticleUrl, getAbsoluteRssUrl } from './routes';
import { getArticleDate } from './date';

const getRssArticles = (url: string, articles: LinkInfo[]): string =>
	articles
		.map(
			article =>
				`<item>
        <title>${article.meta.title}</title>
        <description>${article.meta.description}</description>
        <link>${getAbsoluteArticleUrl(url, article.id)}</link>
        <guid>${getAbsoluteArticleUrl(url, article.id)}</guid>
        <pubDate>${getArticleDate(article).toUTCString()}</pubDate>
        <content:encoded> 
            <div style="margin-top: 50px; font-style: italic;">
              <strong>
                <a href="${article.fullUrl}">Keep reading</a>
              </strong>  
            </div>
        </content:encoded>
    </item>`
		)
		.join('');

const getRssChannel = (url: string, articles: string): string =>
	`<channel>
        <atom:link href="${getAbsoluteRssUrl(url)}" rel="self" type="application/rss+xml" />
        <title>Nothing Else | Sergey Nikitin</title>
        <link>${url}</link>
        <description>Hey there, it's Sergey. I'm a software engineer from Amsterdam, The Netherlands. I explore and learn everything related to Frontend, NodeJS, and Web overall.</description>
        ${articles}
    </channel>`;

const getRssContainer = (channel: string): string =>
	`<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" 
             xmlns:atom="http://www.w3.org/2005/Atom"
             xmlns:dc="https://purl.org/dc/elements/1.1/"
             xmlns:content="https://purl.org/rss/1.0/modules/content/"
        >
            ${channel}
        </rss>`;

export const generateRss = (host: string, articles: LinkInfo[]): string => {
	const fullHost = `https://${host}`;
	const rssData = getRssArticles(fullHost, articles);
	const channel = getRssChannel(fullHost, rssData);
	const container = getRssContainer(channel);
	return container;
};

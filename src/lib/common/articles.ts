import type { LinkInfo } from '$lib/common/@types/common';

export const MY_BLOG_SERVICE = 'MY-BLOG';

export const isInternalArticle = (article: LinkInfo): boolean => {
	return article.service === MY_BLOG_SERVICE;
};

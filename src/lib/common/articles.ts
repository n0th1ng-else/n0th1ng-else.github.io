import type { InternalPublicationInfo, PublicationInfo } from '$lib/types';

export const isInternalArticle = (article: PublicationInfo): article is InternalPublicationInfo => {
	return article.internal;
};

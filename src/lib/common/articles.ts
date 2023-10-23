import type { InternalPublicationInfo, PublicationInfo } from '$lib/common/@types/common';

export const isInternalArticle = (article: PublicationInfo): article is InternalPublicationInfo => {
	return article.internal;
};

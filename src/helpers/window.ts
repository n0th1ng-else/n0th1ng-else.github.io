import type { EmptyToVoid } from '../types';

export const putNewArticleHandlerIntoWindow = (handler: EmptyToVoid): void => {
	window.newArticle = handler;
};

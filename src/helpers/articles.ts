import type { LinkInfo } from '../../common';
import { getArticles } from './selectors';

export const getEngArticles = (): LinkInfo[] =>
	getArticles().filter(article => article.lang === 'en');

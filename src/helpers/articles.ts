import { getArticles } from './selectors';

export const getEngArticles = () => getArticles().filter(article => article.lang === 'en');

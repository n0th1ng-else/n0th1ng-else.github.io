import { format, getYear } from 'date-fns';
import type { LinkInfo } from '../../common';

export const getRelativeDate = (dateInPast?: string | null): string => {
	if (!dateInPast) {
		return '';
	}

	const dateToConvert = new Date(dateInPast);
	return format(dateToConvert, 'd MMMM, yyyy');
};

const getArticleDate = (item: LinkInfo) =>
	item.meta.date ? new Date(item.meta.date) : new Date(0);

export const sortByDate = (list: LinkInfo[]): LinkInfo[] =>
	list.sort((iA, iB) => getArticleDate(iB).getTime() - getArticleDate(iA).getTime());

export const groupByYear = (list: LinkInfo[]): Record<number, LinkInfo[]> =>
	sortByDate(list).reduce((chunks, info) => {
		const year = getYear(getArticleDate(info));
		if (chunks[year]) {
			chunks[year] = [...chunks[year], info];
			return chunks;
		}

		chunks[year] = [info];
		return chunks;
	}, {});

export const getCurrentYear = (): number => getYear(new Date());

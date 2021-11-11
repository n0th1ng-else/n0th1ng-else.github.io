import {
	format,
	getYear,
	differenceInCalendarDays,
	differenceInHours,
	differenceInMinutes
} from 'date-fns';
import type { LinkInfo } from '../../common';

export const getDateTime = (date: Date): string => format(date, 'HH:mm:ss');

export const getRelativeDate = (dateInPast?: string | null): string => {
	if (!dateInPast) {
		return '';
	}

	const dateToConvert = new Date(dateInPast);
	return format(dateToConvert, 'd MMMM, yyyy');
};

export const getArticleDate = (item: LinkInfo): Date =>
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

export const dateDifference = (start?: Date): string => {
	if (!start) {
		return '0m';
	}
	const end = new Date();
	const [d, h, m] = [
		differenceInCalendarDays(end, start),
		differenceInHours(end, start),
		differenceInMinutes(end, start)
	];
	return `${d}d ${h}h ${m}m`;
};

export const dateDifferenceHours = (start?: Date): number => {
	if (!start) {
		return 0;
	}
	const end = new Date();
	return differenceInHours(end, start);
};

import { format, getYear } from 'date-fns';
import type { PublicationInfo } from '$lib/types';

export const ONE_SECOND = 1_000;

const ONE_MINUTE = 60 * ONE_SECOND;

const ONE_HOUR = 60 * ONE_MINUTE;

const ONE_DAY = 24 * ONE_HOUR;

export const enum Timeout {
	Fast = 100
}

export const getDateTime = (date: Date): string => format(date, 'HH:mm:ss');

export const getDateString = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getRelativeDate = (dateInPast?: string | null): string => {
	if (!dateInPast) {
		return '';
	}

	const dateToConvert = new Date(dateInPast);
	return format(dateToConvert, 'd MMMM, yyyy');
};

export const sortByDate = <Item>(list: Item[], handler: (i: Item) => Date): Item[] =>
	list.sort((iA, iB) => handler(iB).getTime() - handler(iA).getTime());

export const getArticleDate = (item: PublicationInfo): Date =>
	item.meta.date ? new Date(item.meta.date) : new Date(0);

export const sortArticlesByDate = (list: PublicationInfo[]): PublicationInfo[] =>
	sortByDate(list, i => getArticleDate(i));

export const groupByYear = (list: PublicationInfo[]): Record<number, PublicationInfo[]> =>
	sortArticlesByDate(list).reduce<Record<number, PublicationInfo[]>>((chunks, info) => {
		const year = getYear(getArticleDate(info));
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
		return '0d 0h 0m';
	}
	const end = new Date();
	const ms = end.getTime() - start.getTime();

	const [d, h, m] = [ONE_DAY, ONE_HOUR, ONE_MINUTE].reduce<{ ms: number; parts: number[] }>(
		(acc, frame) => {
			const newPart = Math.floor(acc.ms / frame);
			const newMs = acc.ms - newPart * frame;
			return {
				ms: newMs,
				parts: [...acc.parts, newPart]
			};
		},
		{ ms, parts: [] }
	).parts;

	return `${d}d ${h}h ${m}m`;
};

export const dateDifferenceHours = (start?: Date): number => {
	if (!start) {
		return 0;
	}
	const end = new Date();
	const ms = end.getTime() - start.getTime();
	return Math.floor(ms / ONE_HOUR);
};

export const secondsToMinutes = (timeSec: number): number => {
	const secondsInMinute = Math.floor(ONE_MINUTE / ONE_SECOND);
	return Math.ceil(timeSec / secondsInMinute);
};

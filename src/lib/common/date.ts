import { format, getYear } from 'date-fns';
import type { LinkInfo } from '$lib/common/@types/common';

export enum One {
	Second = 1_00,
	Minute = 60 * 1_000,
	Hour = 60 * 60 * 1_000,
	Day = 24 * 60 * 60 * 1_000
}

export enum Timeout {
	Fast = 100
}

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
		return '0d 0h 0m';
	}
	const end = new Date();
	const ms = end.getTime() - start.getTime();

	const [d, h, m] = [One.Day, One.Hour, One.Minute].reduce<{ ms: number; parts: number[] }>(
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
	return Math.floor(ms / One.Hour);
};

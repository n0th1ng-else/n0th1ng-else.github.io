import type { LinkInfo } from '../../common';

export const sortAsNumber = (list: string[]): string[] =>
	list.sort((iA, iB) => Number(iB) - Number(iA));

export const sortByDate = (list: LinkInfo[]): LinkInfo[] =>
	list.sort(
		(iA, iB) => new Date(iB.meta.date || 0).getTime() - new Date(iA.meta.date || 0).getTime()
	);

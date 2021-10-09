export const sortAsNumber = (list: string[]): string[] =>
	list.sort((iA, iB) => Number(iB) - Number(iA));

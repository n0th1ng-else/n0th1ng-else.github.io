export const sortAsNumber = (list: string[]): string[] =>
	list.sort((iA, iB) => Number(iB) - Number(iA));

export const sortAsText = (list: string[]): string[] => list.sort((iA, iB) => iA.localeCompare(iB));

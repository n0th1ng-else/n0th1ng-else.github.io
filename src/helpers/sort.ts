export function getSortedList(list: LinkInfo[]): LinkInfo[] {
	return list.sort(
		(iA, iB) => new Date(iB.meta.date || 0).getTime() - new Date(iA.meta.date || 0).getTime()
	);
}

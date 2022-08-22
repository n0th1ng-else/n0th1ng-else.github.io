export const keywordsFromString = (keywords: string): string[] =>
	keywords
		.split(',')
		.map(keyword => keyword.trim())
		.filter(Boolean)
		.slice(0, 4);

export const copyToClipboard = (text: string): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (navigator.clipboard) {
		return navigator.clipboard.writeText(text);
	}

	// TODO implement copy fallback
	return Promise.reject(new Error('The clipboard api is not available'));
};

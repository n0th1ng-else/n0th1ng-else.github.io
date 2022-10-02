export const copyToClipboard = (text: string): Promise<void> => {
	const clip = navigator.clipboard;
	if (clip) {
		return clip.writeText(text);
	}

	// TODO implement copy fallback
	return Promise.reject(new Error('The clipboard api is not available'));
};

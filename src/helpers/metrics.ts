export const getFirstContentfulPaint = (fn: (time: string) => void): void => {
	if (!window.performance) {
		return;
	}

	const performance = window.performance;
	const entries = performance.getEntriesByType('paint');
	const fcp = entries.find(e => e.name === 'first-contentful-paint');
	if (fcp) {
		const oneSec = 1_000;
		fn((fcp.startTime / oneSec).toFixed(3));
		return;
	}

	setTimeout(() => getFirstContentfulPaint(fn), 100);
};

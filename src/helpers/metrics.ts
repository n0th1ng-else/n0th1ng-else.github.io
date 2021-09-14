export const getFirstContentfulPaint = (fn: (time: string) => void): void => {
	if (!window.performance) {
		return;
	}

	const performance = window.performance;
	const entries = performance.getEntriesByType('paint');
	const fcp = entries.find(e => e.name === 'first-contentful-paint');
	if (fcp) {
		const oneSec = 1_000;
		const moreThanSec = fcp.startTime >= oneSec;
		fn(moreThanSec ? (fcp.startTime / oneSec).toFixed(2) : fcp.startTime.toFixed());
		return;
	}

	setTimeout(() => getFirstContentfulPaint(fn), 100);
};

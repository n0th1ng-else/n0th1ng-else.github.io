import { One, Timeout } from '$lib/common/date';

export const getFirstContentfulPaint = (fn: (time: string) => void): void => {
	const performance = window?.performance;
	if (!performance) {
		return;
	}

	const entries = performance.getEntriesByType('paint');
	const fcp = entries.find(({ name }) => name === 'first-contentful-paint');
	if (fcp) {
		fn((fcp.startTime / One.Second).toFixed(3));
		return;
	}

	setTimeout(() => getFirstContentfulPaint(fn), Timeout.Fast);
};

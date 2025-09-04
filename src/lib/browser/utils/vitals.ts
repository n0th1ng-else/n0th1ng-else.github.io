import { ONE_SECOND, Timeout } from '$lib/common/date';
import { Logger } from '$lib/common/log';

const logger = new Logger('fcp');

export const getFirstContentfulPaint = (fn: (time: string) => void): void => {
	try {
		const performance = window.performance;
		const entries = performance.getEntriesByType('paint');
		const fcp = entries.find(({ name }) => name === 'first-contentful-paint');
		if (fcp) {
			fn((fcp.startTime / ONE_SECOND).toFixed(3));
			return;
		}
	} catch (err: unknown) {
		logger.warn('Failed to get first contentful paint', err);
	}

	setTimeout(() => {
		getFirstContentfulPaint(fn);
	}, Timeout.Fast);
};

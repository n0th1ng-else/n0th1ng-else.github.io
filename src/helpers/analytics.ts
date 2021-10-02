import { Logger } from './log';

export const sendPageView = (attempt = 3): void => {
	const path = `${location.pathname}${location.search}${location.hash}`;

	try {
		gtag('event', 'pageview', {
			page_path: path
		});
	} catch (err) {
		if (!attempt) {
			new Logger('analytics').error('Unable to send page view data', err);
			return;
		}
		setTimeout(() => sendPageView(attempt - 1), 1_000);
	}
};

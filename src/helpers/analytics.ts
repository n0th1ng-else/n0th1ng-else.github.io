import { Logger } from './log';

export const sendPageView = (): void => {
	const path = `${location.pathname}${location.search}${location.hash}`;

	try {
		gtag('event', 'pageview', {
			page_path: path
		});
	} catch (err) {
		new Logger('analytics').error('Unable to send page view data', err);
	}
};

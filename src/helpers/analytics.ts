import { Logger } from './log';

export const sendPageView = (pageUrl: string, attempt = 3): void => {
	try {
		gtag('event', 'pageview', {
			page_path: pageUrl
		});
	} catch (err) {
		if (!attempt) {
			new Logger('analytics').error('Unable to send page view data', err);
			return;
		}
		setTimeout(() => sendPageView(pageUrl, attempt - 1), 1_000);
	}
};

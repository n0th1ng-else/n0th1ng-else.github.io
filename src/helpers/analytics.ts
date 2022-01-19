import { Logger } from './log';
import { getUpTime, getUpTimeHours } from './uptime';

const RETRY_INTERVAL = 1_000;

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
		setTimeout(() => sendPageView(pageUrl, attempt - 1), RETRY_INTERVAL);
	}
};

// TODO: from the server, not browser :thinking:
export const sendTickFromServer = (attempt = 3): void => {
	try {
		gtag('event', 'uptime_event', {
			event_category: 'server uptime',
			event_label: getUpTime(),
			value: getUpTimeHours()
		});
	} catch (err) {
		if (!attempt) {
			new Logger('analytics').error('Unable to send uptime tick', err);
			return;
		}
		setTimeout(() => sendTickFromServer(attempt - 1), RETRY_INTERVAL);
	}
};

import { Logger } from './log';

const logger = new Logger('uptime');

const interval = 60_000;

let timerHandler: NodeJS.Timeout | undefined;

const checkStatus = (url: string): Promise<void> =>
	fetch(url)
		.then(response => response.json())
		.then(
			data => logger.error('Health status response', data),
			err => logger.error('Unable to access the health status api!', err)
		);

export const initUptime = (host: string): void => {
	if (timerHandler) {
		return;
	}

	logger.warn('Initializing the status handler');
	const statusUrl = `https://${host}/status`;
	checkStatus(statusUrl);
	timerHandler = setInterval(() => {
		logger.warn('Check the health status', statusUrl);
		checkStatus(statusUrl);
	}, interval);
};

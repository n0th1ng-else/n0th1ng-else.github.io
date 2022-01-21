import { Logger } from './log';
import { dateDifference, dateDifferenceHours } from './date';

const logger = new Logger('uptime');

const interval = 60_000;

let timerHandler: NodeJS.Timeout | undefined;
let startDate: Date | undefined;

const checkStatus = (url: string): Promise<void> =>
	fetch(url)
		.then(response => response.json())
		.then(
			data => logger.error('Health status response', data),
			err => logger.error('Unable to access the health status api!', err)
		);

export const initUptime = (host?: string): void => {
	if (timerHandler) {
		return;
	}

	logger.warn('Initializing the status handler');
	startDate = new Date();
	const protocol = host && host.includes('localhost') ? 'http' : 'https';
	const statusUrl = `${protocol}://${host}/status`;
	checkStatus(statusUrl);
	timerHandler = setInterval(() => {
		logger.warn('Check the health status', statusUrl);
		checkStatus(statusUrl);
	}, interval);
};

export const getUpTime = (): string => dateDifference(startDate);

export const getUpTimeHours = (): number => dateDifferenceHours(startDate);

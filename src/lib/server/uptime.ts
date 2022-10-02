import { Logger } from '$lib/common/log';
import { dateDifference, dateDifferenceHours } from '$lib/common/date';
import { runApi } from '$lib/common/api';
import type { StatusDto } from '$lib/common/api/types';

const logger = new Logger('uptime');

const interval = 60_000;

let timerHandler: NodeJS.Timeout | undefined;
let startDate: Date | undefined;

const checkStatus = (url: string): Promise<void> =>
	runApi<StatusDto>(url).then(
		data => logger.warn('Health status response', data),
		err => logger.error('Unable to access the health status api!', err)
	);

export const initUptime = (host?: string): void => {
	if (timerHandler) {
		return;
	}

	logger.warn('Initializing the status handler');
	startDate = new Date();
	const statusUrl = `${host}/status`;
	checkStatus(statusUrl);
	timerHandler = setInterval(() => {
		logger.warn('Check the health status', statusUrl);
		checkStatus(statusUrl);
	}, interval);
};

export const getUpTime = (): string => dateDifference(startDate);

export const getUpTimeHours = (): number => dateDifferenceHours(startDate);

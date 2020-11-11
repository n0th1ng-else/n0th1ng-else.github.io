import { formatDistanceToNow, addYears, isBefore, format } from 'date-fns';

export const getRelativeDate = (dateInPast?: string | null): string => {
	if (!dateInPast) {
		return '';
	}

	const dateToConvert = new Date(dateInPast);
	const dateNow = new Date();

	const yearAfter = addYears(dateToConvert, 1);
	const isOld = isBefore(yearAfter, dateNow);

	if (isOld) {
		return format(dateToConvert, 'dd MMM yyyy');
	}
	return formatDistanceToNow(dateToConvert, { addSuffix: true });
};

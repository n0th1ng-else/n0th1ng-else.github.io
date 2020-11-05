import { formatDistance } from 'date-fns';

export const getRelativeDate = (dateInPast?: string | null): string => {
	if (!dateInPast) {
		return '';
	}

	return formatDistance(new Date(dateInPast), new Date(), { addSuffix: true });
};

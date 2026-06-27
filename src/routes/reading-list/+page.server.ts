import { getReadingList } from '$lib/server/content';
import type { ReadingListItem } from '$lib/common/readingList';
import type { PageServerLoad } from './$types';

interface Output {
	url: string;
	items: ReadingListItem[];
}

export const load: PageServerLoad<Output> = ({ url }) => ({
	url: url.toString(),
	items: getReadingList()
});

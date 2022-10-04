import { error } from '@sveltejs/kit';
import { getAllArticles } from '$lib/server/articles';
import { getProfile } from '$lib/common/api';
import { sortByDate } from '$lib/common/date';
import { generateRss } from '$lib/server/rss';
import { getXMLHeaders } from '$lib/server/xml';
import type { MetaInfo } from '$lib/common/@types/common';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url: urlData }) => {
	const url = urlData.origin;
	let profile: MetaInfo | null = null;

	try {
		profile = await getProfile(url);
	} catch (e) {
		throw error(500, 'Something went wrong');
	}

	const articles = sortByDate(getAllArticles());

	return new Response(generateRss(url, profile.image, articles), {
		headers: getXMLHeaders()
	});
};

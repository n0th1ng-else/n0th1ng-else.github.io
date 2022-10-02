import { error } from '@sveltejs/kit';
import { getSelfUrl } from '$lib/server/selectors';
import { getAllArticles } from '$lib/server/articles';
import { getProfile, getUrlPrefix } from '$lib/common/api';
import { One, sortByDate } from '$lib/common/date';
import { generateRss } from '$lib/server/rss';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url: urlData }) => {
	const url = urlData.origin;
	try {
		const profile = await getProfile(url);

		const articles = sortByDate(getAllArticles());
		const selfUrl = getUrlPrefix(getSelfUrl());

		const TEN_MINUTES = One.Minute * 10;
		return new Response(generateRss(selfUrl, profile.image, articles), {
			headers: {
				'Cache-Control': `max-age=0, s-maxage=${TEN_MINUTES}`, // 10 minutes
				'Content-Type': 'application/xml'
			}
		});
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

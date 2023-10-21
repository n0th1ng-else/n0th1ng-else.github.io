import type { LinkInfo } from '$lib/common/@types/common';

export const MY_BLOG_SERVICE = 'MY-BLOG';

const WORDS_PER_MIN = 220;

const IMAGES = {
	INITIAL_PAUSE_SEC: 10,
	MINIMAL_PAUSE_SEC: 5
};

export const isInternalArticle = (article: LinkInfo): boolean => {
	return article.service === MY_BLOG_SERVICE;
};

export const getReadingTime = (raw: string, parsed: string): number => {
	const handler = new Intl.Segmenter([], { granularity: 'word' });
	const segmentedText = handler.segment(raw);
	const wordsCount = [...segmentedText].filter(s => s.isWordLike).length;
	const wordsPerSec = WORDS_PER_MIN / 60;

	const imagesCount = parsed.split('mkdn-img').length - 1;
	const imagesTime = new Array(imagesCount)
		.fill(null)
		.map((_, index) => {
			const current = IMAGES.INITIAL_PAUSE_SEC - index;
			return current < IMAGES.MINIMAL_PAUSE_SEC ? IMAGES.MINIMAL_PAUSE_SEC : current;
		})
		.reduce((sum, pause) => sum + pause, 0);

	return Math.ceil(wordsCount / wordsPerSec) + imagesTime;
};

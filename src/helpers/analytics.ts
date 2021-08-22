export const sendPageView = (): void => {
	const path = `${location.pathname}${location.search}${location.hash}`;

	gtag('event', 'pageview', {
		page_path: path
	});
};

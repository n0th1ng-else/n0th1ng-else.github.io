export const sendPageView = (): void => {
	const path = `${location.pathname}${location.search}${location.hash}`;

	try {
		gtag('event', 'pageview', {
			page_path: path
		});
	} catch (err) {
		// TODO implement
	}
};

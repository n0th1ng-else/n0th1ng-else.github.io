export const getXMLHeaders = () => {
	const oneHour = 3600; // in seconds
	return {
		'Cache-Control': `max-age=0, s-maxage=${oneHour}`, // 10 minutes
		'Content-Type': 'application/xml'
	};
};

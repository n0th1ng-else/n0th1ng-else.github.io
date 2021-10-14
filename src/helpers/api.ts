export const convertMarkdown = (content: string): Promise<string> =>
	fetch('/api/v1/markdown', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: content
		})
	})
		.then(result => result.json())
		.then(({ result }) => result);

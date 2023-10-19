export const shouldShowDraft = (url: URL) => url.searchParams.get('draft') === 'true';

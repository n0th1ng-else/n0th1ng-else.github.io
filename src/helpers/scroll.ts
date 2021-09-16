const scroll = (top = 0): void => window.scrollTo({ top, behavior: 'smooth' });

export const scrollToBottom = (): void => scroll(document.body.scrollHeight);

export const scrollToTop = (): void => scroll();

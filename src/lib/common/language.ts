export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;

export type ArticleLanguage = (typeof SUPPORTED_LANGUAGES)[number];

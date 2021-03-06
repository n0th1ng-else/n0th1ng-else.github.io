export const getEmail = (): string => 'srg.post@gmail.com';

export const getTwitterLink = (account: string): string => `https://twitter.com/${account}`;

export const getMediumLink = (account: string): string => `https://${account}.medium.com`;

export const getGithubLink = (account: string): string => `https://github.com/${account}`;

export const getLinkedInLink = (account: string): string => `${account}`; // TODO

export const getHabrLink = (account: string): string => `https://habr.com/users/${account}`;

export const getEmailLink = (email: string): string => `mailto:${email}`;

export const getGMapsLink = (query: string): string =>
	`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

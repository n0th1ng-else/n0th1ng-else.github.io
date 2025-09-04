import type { PageServerLoad } from './$types';

interface Output {
	url: string;
}
export const load: PageServerLoad<Output> = ({ url }) => {
	return {
		url: url.toString()
	};
};

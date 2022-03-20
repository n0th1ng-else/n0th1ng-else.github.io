import { getUrlPrefix } from '../helpers/api';

export class TagModel {
	constructor(public readonly title: string, private readonly url: string) {}

	public getUrl(): string {
		return getUrlPrefix(this.url);
	}
}

export const tags: TagModel[] = [
	new TagModel('Typescript', 'www.typescriptlang.org'),
	new TagModel('Angular', 'angular.io'),
	new TagModel('NodeJS', 'nodejs.org'),
	new TagModel('Svelte', 'svelte.dev'),
	new TagModel('React', 'reactjs.org'),
	new TagModel('Redux', 'redux.js.org'),
	new TagModel('Babel', 'babeljs.io'),
	new TagModel('Prettier', 'prettier.io'),
	new TagModel('ESLint', 'eslint.org'),
	new TagModel('Jest', 'jestjs.io'),
	new TagModel('Webpack', 'webpack.js.org')
];

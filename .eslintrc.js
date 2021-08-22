const getCfg = () => {
	return {
		root: true,
		parser: '@typescript-eslint/parser',
		plugins: ['svelte3', '@typescript-eslint'],
		overrides: [
			{
				files: ['*.svelte'],
				processor: 'svelte3/svelte3'
			}
		],
		env: {
			node: true,
			browser: true,
			es6: true
		},
		globals: {
			runtime: true
		},
		extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
		rules: {
			'no-mixed-spaces-and-tabs': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'no-console': 'error'
		},
		settings: {
			'svelte3/typescript': () => require('typescript'),
			'svelte3/ignore-styles': () => true
		}
	};
};

module.exports = getCfg();

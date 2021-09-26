import { resolve as resolvePath } from 'path';
import preprocess from 'svelte-preprocess';
import inject from '@rollup/plugin-inject';
import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';

const isStatic = process.env.BUILD_STATIC === 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		appDir: 'generated',
		adapter: isStatic
			? staticAdapter({
					pages: 'dist',
					assets: 'dist'
			  })
			: nodeAdapter({
					out: 'dist'
			  }),
		vite: {
			plugins: [
				inject({
					runtime: resolvePath('./runtime.js')
				})
			]
		}
	}
};

export default config;

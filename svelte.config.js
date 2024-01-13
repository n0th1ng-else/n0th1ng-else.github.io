import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';

const isStatic = process.env.BUILD_STATIC === 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		// target: '#svelte',
		appDir: 'generated',
		adapter: isStatic
			? staticAdapter({
					pages: 'dist',
					assets: 'dist'
				})
			: nodeAdapter({
					out: 'dist'
				})
	}
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import inject from '@rollup/plugin-inject';
import { resolve as resolvePath } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()]
};

export default config;

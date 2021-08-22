import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import inject from '@rollup/plugin-inject';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import { resolve as resolvePath } from 'path';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (!server) {
			return;
		}

		server.kill(0);
	}

	return {
		writeBundle() {
			if (server) {
				return;
			}

			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/index.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		json(),
		image(),
		inject({
			runtime: resolvePath('./runtime.js')
		}),
		svelte({
			compilerOptions: {
				dev: !production
			},
			emitCss: true,
			preprocess: sveltePreprocess()
		}),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		postcss({
			extract: true,
			minimize: true,
			use: [
				[
					'sass',
					{
						includePaths: ['./src/theme', './node_modules']
					}
				]
			]
		}),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

import 'svelte';
import App from './routes/__layout.svelte';
import { recoverTheme } from './helpers/theme';

const target = document.querySelector('main');

if (!target) {
	throw new Error('Could not find app container...');
}

recoverTheme();

new App({
	target,
	anchor: undefined,
	props: {},
	hydrate: false,
	intro: false
});

import 'svelte';
import App from './routes/__layout.svelte';

const target = document.querySelector('main');

if (!target) {
	throw new Error('Could not find app container...');
}

new App({
	target,
	anchor: undefined,
	props: {},
	hydrate: false,
	intro: false
});

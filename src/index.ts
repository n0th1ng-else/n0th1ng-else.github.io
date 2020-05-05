import App from './components/App.svelte';

const target = document.querySelector('main');

if (!target) {
	throw new Error('Could not find app container...');
}

new App({
	target,
	anchor: null,
	props: {},
	hydrate: false,
	intro: false
});

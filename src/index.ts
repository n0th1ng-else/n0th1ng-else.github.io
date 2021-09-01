import 'svelte';
import './index.scss';
import App from './components/App.svelte';

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

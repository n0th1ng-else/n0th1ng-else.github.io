import App from './components/App.svelte';
import './index.scss';
import 'evil-icons/assets/evil-icons';

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

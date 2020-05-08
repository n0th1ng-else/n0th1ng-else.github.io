<script>
	import { wrap, push } from 'svelte-spa-router';
	import Router from 'svelte-spa-router';

	import BlankComponent from '../routes/BlankComponent.svelte';
	import Chronic from '../routes/Chronic.svelte';
	import Contact from '../routes/Contact.svelte';
	import Info from '../routes/Info.svelte';
	import PublicationEn from '../routes/PublicationEn.svelte';
	import PublicationRu from '../routes/PublicationRu.svelte';
	import { RoutePath, toPath } from '../routes';

	const routes = {
		[toPath()]: wrap(BlankComponent, () => push(toPath(RoutePath.Info))),
		[toPath(RoutePath.Chronic)]: Chronic,
		[toPath(RoutePath.Contact)]: Contact,
		[toPath(RoutePath.Info)]: Info,
		[toPath([RoutePath.Publication, RoutePath.En])]: PublicationEn,
		[toPath([RoutePath.Publication, RoutePath.Ru])]: PublicationRu,
		[toPath(RoutePath.Other)]: wrap(BlankComponent, () => push(toPath(RoutePath.Info)))
	};

	const toChronics = () => push(toPath(RoutePath.Chronic));
	const toContact = () => push(toPath(RoutePath.Contact));
	const toInfo = () => push(toPath(RoutePath.Info));
	const toEnPublication = () => push(toPath([RoutePath.Publication, RoutePath.En]));
	const toRuPublication = () => push(toPath([RoutePath.Publication, RoutePath.Ru]));
</script>

<div>
	<div>
		<button on:click="{toChronics}">Chronic</button>
		<button on:click="{toContact}">Contact</button>
		<button on:click="{toInfo}">Info</button>
		<button on:click="{toEnPublication}">Pub en</button>
		<button on:click="{toRuPublication}">Pub ru</button>
	</div>
	<div>
		<Router routes="{routes}" />
	</div>
</div>

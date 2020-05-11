<style>
	.padded-block {
		margin: 10px;
	}

	.with-space {
		margin-bottom: 10px;
	}
</style>

<script>
	import { wrap, push } from 'svelte-spa-router';
	import Router from 'svelte-spa-router';
	import BlankComponent from '../routes/BlankComponent.svelte';
	import Chronic from '../routes/Chronic.svelte';
	import Contact from '../routes/Contact.svelte';
	import Info from '../routes/Info.svelte';
	import Publication from '../routes/Publication.svelte';
	import { RoutePath, toPath } from '../routes';
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import BasicInfo from './BasicInfo.svelte';
	import { labels } from '../labels';

	const routes = {
		[toPath(RoutePath.Chronic)]: wrap(Chronic, { path: RoutePath.Chronic }),
		[toPath(RoutePath.Contact)]: wrap(Contact, { path: RoutePath.Contact }),
		[toPath(RoutePath.Info)]: wrap(Info, { path: RoutePath.Info }),
		[toPath(RoutePath.Publication)]: wrap(Publication, { path: RoutePath.Publication }),

		[toPath()]: wrap(BlankComponent, () => push(toPath(RoutePath.Info))),
		[toPath(RoutePath.Other)]: wrap(BlankComponent, () => push(toPath(RoutePath.Info)))
	};

	const tabs = [
		{
			label: labels.tabs[RoutePath.Chronic],
			id: RoutePath.Chronic
		},
		{
			label: labels.tabs[RoutePath.Contact],
			id: RoutePath.Contact
		},
		{
			label: labels.tabs[RoutePath.Info],
			id: RoutePath.Info
		},
		{
			label: labels.tabs[RoutePath.Publication],
			id: RoutePath.Publication
		}
	];

	let activeTab = tabs[0];
	let tab;
	const profile = runtime.meta.profile;

	const routeLoaded = event => {
		const id = event.detail.userData.path;
		const routeTab = tabs.find(tab => tab.id === id);
		if (routeTab) {
			activeTab = routeTab;
		}
	};

	const selectTab = () =>
		setTimeout(() => {
			const id = activeTab.id;
			push(toPath(id));
		});
</script>

<div>
	<div class="padded-block">
		<div class="with-space">
			<BasicInfo profile="{profile}" />
		</div>
		<div>
			<TabBar tabs="{tabs}" bind:active="{activeTab}" let:tab>
				<Tab tab="{tab}" minWidth on:click="{selectTab}">
					<Label>{tab.label}</Label>
				</Tab>
			</TabBar>
		</div>
	</div>
	<div>
		<Router routes="{routes}" on:routeLoaded="{routeLoaded}" />
	</div>
</div>

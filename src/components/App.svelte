<style lang="scss">
	@import '../global';

	.app-page {
		max-width: $max-content-width;
		margin: auto;
	}

	.with-space {
		margin-bottom: $unit-half;
	}
</style>

<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import type { MetaInfo } from '../../common';
	import { push } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import Router from 'svelte-spa-router';
	import BlankComponent from '../routes/BlankComponent.svelte';
	import Chronic from '../routes/Chronic.svelte';
	import Contact from '../routes/Contact.svelte';
	import Info from '../routes/Info.svelte';
	import Publication from '../routes/Publication.svelte';
	import Package from '../routes/Package.svelte';
	import BasicInfo from './BasicInfo.svelte';
	import { RoutePath, toPath } from '../routes';
	import { getProfile } from '../helpers/global';
	import { tabs } from '../data/tabs';

	const routes = {
		[toPath(RoutePath.Chronic)]: wrap({
			component: Chronic,
			userData: { path: RoutePath.Chronic }
		}),
		[toPath(RoutePath.Contact)]: wrap({
			component: Contact,
			userData: { path: RoutePath.Contact }
		}),
		[toPath(RoutePath.Info)]: wrap({ component: Info, userData: { path: RoutePath.Info } }),
		[toPath(RoutePath.Publication)]: wrap({
			component: Publication,
			userData: { path: RoutePath.Publication }
		}),
		[toPath(RoutePath.Package)]: wrap({
			component: Package,
			userData: { path: RoutePath.Package }
		}),

		[toPath()]: wrap({
			component: BlankComponent,
			userData: { path: RoutePath.Info },
			conditions: () => push(toPath(RoutePath.Info)).then(() => true)
		}),
		[toPath(RoutePath.Other)]: wrap({
			component: BlankComponent,
			userData: { path: RoutePath.Info },
			conditions: () => push(toPath(RoutePath.Info)).then(() => true)
		})
	};

	let activeTab = tabs[0];
	let tab;
	const profile: MetaInfo = getProfile();

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

<div class="app-page">
	<div>
		<div class="with-space">
			<BasicInfo profile="{profile}" />
		</div>
		<div class="padded-block">
			<TabBar tabs="{tabs}" bind:active="{activeTab}" let:tab>
				<Tab tab="{tab}" minWidth on:click="{selectTab}">
					<Label>{tab.label}</Label>
				</Tab>
			</TabBar>
		</div>
	</div>
	<div class="padded-block">
		<Router routes="{routes}" on:routeLoaded="{routeLoaded}" />
	</div>
</div>

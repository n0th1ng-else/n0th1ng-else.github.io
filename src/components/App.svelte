<style lang="scss">
	@import '../global';

	.app-page {
		max-width: $max-content-width-full;
		margin: $unit-double auto;
	}

	.app-block {
		margin: 0 $unit;
	}

	.with-space {
		margin-bottom: $unit-half;
	}
</style>

<script lang="ts">
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import type { MetaInfo } from '../../common';
	import { push } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import Router from 'svelte-spa-router';
	import BlankComponent from '../routes/BlankComponent.svelte';
	import News from '../routes/News.svelte';
	import Contacts from '../routes/Contacts.svelte';
	import Projects from '../routes/Projects.svelte';
	import Articles from '../routes/Articles.svelte';
	import Packages from '../routes/Packages.svelte';
	import BasicInfo from './BasicInfo.svelte';
	import { RoutePath, toPath } from '../routes';
	import { getProfile } from '../helpers/global';
	import { tabs, getTabById } from '../data/tabs';
	import { sendPageView } from '../helpers/analytics';

	const routes = {
		[toPath(RoutePath.News)]: wrap({
			component: News,
			userData: { path: RoutePath.News }
		}),
		[toPath(RoutePath.Contacts)]: wrap({
			component: Contacts,
			userData: { path: RoutePath.Contacts }
		}),
		[toPath(RoutePath.Projects)]: wrap({
			component: Projects,
			userData: { path: RoutePath.Projects }
		}),
		[toPath(RoutePath.Articles)]: wrap({
			component: Articles,
			userData: { path: RoutePath.Articles }
		}),
		[toPath(RoutePath.Packages)]: wrap({
			component: Packages,
			userData: { path: RoutePath.Packages }
		}),

		[toPath()]: wrap({
			component: BlankComponent,
			userData: { path: RoutePath.Articles },
			conditions: () => push(toPath(RoutePath.Articles)).then(() => true)
		}),
		[toPath(RoutePath.Other)]: wrap({
			component: BlankComponent,
			userData: { path: RoutePath.Articles },
			conditions: () => push(toPath(RoutePath.Articles)).then(() => true)
		})
	};

	let activeTab = getTabById();
	let tab;
	const profile: MetaInfo = getProfile();

	const routeLoaded = event => {
		const tabId = event.detail.userData.path;
		activeTab = getTabById(tabId);
		sendPageView();
	};

	const selectTab = (): number =>
		setTimeout(() => {
			const tabId = activeTab.id;
			push(toPath(tabId));
		});
</script>

<div class="app-page">
	<div class="app-block">
		<div class="with-space">
			<BasicInfo profile="{profile}" />
		</div>
		<div class="with-space">
			<TabBar tabs="{tabs}" bind:active="{activeTab}" let:tab>
				<Tab tab="{tab}" minWidth on:click="{selectTab}">
					{#if tab.icon}
						<Icon class="material-icons">{tab.icon}</Icon>
					{/if}
					<Label>{tab.label}</Label>
				</Tab>
			</TabBar>
		</div>
	</div>
	<div class="app-block">
		<Router routes="{routes}" on:routeLoaded="{routeLoaded}" />
	</div>
</div>

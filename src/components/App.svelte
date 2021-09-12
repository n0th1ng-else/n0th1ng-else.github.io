<script lang="ts">
	import Router from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import Container from '../ui/Container.svelte';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import NotFound from '../routes/NotFound.svelte';
	import Article from '../routes/Article.svelte';
	import Home from '../routes/Home.svelte';
	import Blog from '../routes/Blog.svelte';
	import Projects from '../routes/Projects.svelte';
	import About from '../routes/About.svelte';
	import {
		RoutePath,
		homeRoute,
		blogRoute,
		projectsRoute,
		aboutRoute,
		articleRoute,
		notFoundRoute,
		otherRoute
	} from '../routes';
	import { sendPageView } from '../helpers/analytics';

	const routes = {
		[homeRoute]: wrap({
			component: Home,
			userData: { path: RoutePath.Home }
		}),
		[blogRoute]: wrap({
			component: Blog,
			userData: { path: RoutePath.Blog }
		}),
		[articleRoute]: wrap({
			component: Article,
			userData: { path: RoutePath.Blog }
		}),
		[projectsRoute]: wrap({
			component: Projects,
			userData: { path: RoutePath.Projects }
		}),
		[aboutRoute]: wrap({
			component: About,
			userData: { path: RoutePath.About }
		}),
		[notFoundRoute]: wrap({
			component: NotFound,
			userData: { path: RoutePath.NotFound }
		}),

		[otherRoute]: wrap({
			component: NotFound,
			userData: { path: RoutePath.Other }
		})
	};

	const routeLoaded = () => {
		// const pageId = event.detail.userData.path;
		sendPageView();
	};
</script>

<Container>
	<Header />
	<Container>
		<div class="content-wrapper">
			<div class="content">
				<Router routes="{routes}" on:routeLoaded="{routeLoaded}" />
			</div>
		</div>
	</Container>
	<Footer />
</Container>

<style lang="scss">
	@import '../global';
	.content-wrapper {
		margin: 0 auto;
		max-width: $max-content-width;
	}

	.content {
		padding: 0 $unit-half;
	}
</style>

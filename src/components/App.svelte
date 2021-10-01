<script lang="ts">
	import Router, { push } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import MetaColor from '../ui/MetaColor.svelte';
	import Container from '../ui/Container.svelte';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import NotFound from '../routes/__error.svelte';
	import Article from '../routes/blog/[slug].svelte';
	import NewArticle from '../routes/blog/new.svelte';
	import Home from '../routes/index.svelte';
	import Blog from '../routes/blog/index.svelte';
	import Projects from '../routes/projects.svelte';
	import About from '../routes/about.svelte';
	import Legal from '../routes/legal.svelte';
	import ScrollTop from './ScrollTop.svelte';
	import {
		RoutePath,
		homeRoute,
		blogRoute,
		projectsRoute,
		aboutRoute,
		newArticleRoute,
		articleRoute,
		otherRoute,
		legalRoute
	} from '../helpers/routes';
	import { sendPageView } from '../helpers/analytics';
	import { putNewArticleHandlerIntoWindow } from '../helpers/window';

	putNewArticleHandlerIntoWindow(() => push(newArticleRoute));
	let pageId;

	const routes = {
		[homeRoute]: wrap({
			component: Home,
			userData: { path: RoutePath.Home }
		}),
		[blogRoute]: wrap({
			component: Blog,
			userData: { path: RoutePath.Blog }
		}),
		[newArticleRoute]: wrap({
			component: NewArticle,
			userData: {}
		}),
		[articleRoute]: wrap({
			component: Article,
			userData: {}
		}),
		[projectsRoute]: wrap({
			component: Projects,
			userData: { path: RoutePath.Projects }
		}),
		[aboutRoute]: wrap({
			component: About,
			userData: { path: RoutePath.About }
		}),
		[legalRoute]: wrap({
			component: Legal,
			userData: { path: RoutePath.Legal }
		}),

		[otherRoute]: wrap({
			component: NotFound,
			userData: { path: RoutePath.NotFound }
		})
	};

	const routeLoaded = evt => {
		pageId = evt.detail.userData.path;
		sendPageView();
	};
</script>

<MetaColor />
<Container full>
	<Header activePath="{pageId}" />
	<Container>
		<div class="content__wrapper">
			<div class="content">
				<Router routes="{routes}" on:routeLoaded="{routeLoaded}" />
			</div>
		</div>
	</Container>
	<Footer />
	<ScrollTop />
</Container>

<style lang="scss">
	@import '../global';
	.content__wrapper {
		margin: 0 auto;
		max-width: $max-content-width;
	}

	.content {
		padding: 0 $unit-half;
	}
</style>

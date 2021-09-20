<script lang="ts">
	import Router, { push } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import Container from '../ui/Container.svelte';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import NotFound from '../routes/NotFound.svelte';
	import Article from '../routes/Article.svelte';
	import NewArticle from '../routes/NewArticle.svelte';
	import Home from '../routes/Home.svelte';
	import Blog from '../routes/Blog.svelte';
	import Projects from '../routes/Projects.svelte';
	import About from '../routes/About.svelte';
	import Legal from '../routes/Legal.svelte';
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
	} from '../routes';
	import { sendPageView } from '../helpers/analytics';
	import { putNewArticleHandlerIntoWindow } from '../helpers/window';

	putNewArticleHandlerIntoWindow(() => push(newArticleRoute));

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
		[legalRoute]: wrap({
			component: Legal,
			userData: { path: RoutePath.Legal }
		}),

		[otherRoute]: wrap({
			component: NotFound,
			userData: { path: RoutePath.NotFound }
		})
	};

	const routeLoaded = () => {
		// const pageId = event.detail.userData.path;
		sendPageView();
	};
</script>

<Container full>
	<Header />
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

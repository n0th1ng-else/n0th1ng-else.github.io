<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const host = page.host;
		const path = page.path;

		return {
			props: {
				pageUrl: `${host}${path}`
			}
		};
	};
</script>

<script lang="ts">
	import Title from '../ui/Title.svelte';
	import SubTitle from '../ui/SubTitle.svelte';
	import Meta from '../ui/Meta.svelte';
	import Paragraph from '../ui/Paragraph.svelte';
	import { legalTitle as title } from '../labels';
	import { getProfile } from '../helpers/selectors';

	export let pageUrl: string;

	const photo = getProfile().image ?? '';
</script>

<Meta
	image="{photo}"
	description="The legal information regarding the content in my blog. Contrubition guide."
	url="{pageUrl}"
/>
<article>
	<Title>Legal information</Title>
	<SubTitle>Opinions</SubTitle>
	<div class="legal-text">
		<Paragraph>
			All views expressed on this site are my own and do not represent the opinions of any entity
			whatsoever with which I have been, am now, or will be affiliated.
		</Paragraph>
	</div>
	<!-- <SubTitle>Publications</SubTitle>
	<p>
		// TODO add some distribution info
	</p>
	-->
	<SubTitle>Source Code</SubTitle>
	<div class="legal-text">
		<Paragraph
			>In case it is not explicitly specified, all code is distributed under the MIT License:</Paragraph
		>
	</div>
	<div class="legal-text">
		<Paragraph mono>Copyright © Sergey Nikitin</Paragraph>
		<Paragraph mono>
			Permission is hereby granted, free of charge, to any person obtaining a copy of this software
			and associated documentation files (the "Software"), to deal in the Software without
			restriction, including without limitation the rights to use, copy, modify, merge, publish,
			distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
			Software is furnished to do so, subject to the following conditions:
		</Paragraph>
		<Paragraph mono>
			The above copyright notice and this permission notice shall be included in all copies or
			substantial portions of the Software.
		</Paragraph>
		<Paragraph mono>
			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
			BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
			NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
			DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
			OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		</Paragraph>
	</div>
</article>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style lang="scss">
	@import '../global';

	.legal-text {
		margin: $unit 0;
	}
</style>

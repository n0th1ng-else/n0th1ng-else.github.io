<style lang="scss">
	.link--decorated {
		text-decoration-line: underline;
	}
</style>

<script lang="ts">
	export let decorate = false;
	export let href: string;
</script>

<a href="{href}" class:link--decorated="{decorate}" target="_blank" rel="noreferrer noopener">
	<slot />
</a>

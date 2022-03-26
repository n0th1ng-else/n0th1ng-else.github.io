<script lang="ts">
	import { Logger } from '../helpers/log';

	export let image = '';
	export let preview = '';
	export let alt = '';
	export let width = '';
	export let height = '';

	let imageBlob = preview ? preview : image;
	if (preview) {
		fetch(image)
			.then(response => response.blob())
			.then(imgBlob => URL.createObjectURL(imgBlob))
			.then(
				img => (imageBlob = img),
				err => new Logger('image').error('Unable to load image', err)
			);
	}
</script>

<img src="{imageBlob}" alt="{alt}" width="{width}" height="{height}" />

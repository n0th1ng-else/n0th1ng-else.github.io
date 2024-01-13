import { error, json } from '@sveltejs/kit';
import { CloudinaryResource, getUrl, signPayload } from '$lib/server/cloudinary';
import { runRawApi } from '$lib/common/api';
import type { BaseCloudinaryPayload } from '$lib/server/cloudinary';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// TODO read env properly. most likely does not work
	const api = {
		account: process.env.CLOUDINARY_ACCOUNT || '',
		key: process.env.CLOUDINARY_KEY || '',
		secret: process.env.CLOUDINARY_SECRET || ''
	};
	const hasAccess = Object.values(api).filter(Boolean).length === Object.values(api).length;

	if (!hasAccess) {
		error(401, 'Command not available');
	}

	const payload: BaseCloudinaryPayload = {
		api_key: api.key,
		timestamp: new Date().getTime(),
		resource_type: CloudinaryResource.Image,
		upload_preset: 'default'
	};

	const url = getUrl(api.account, CloudinaryResource.Image);
	const signed = signPayload(payload, api.secret);

	const form = await request.formData();
	for (const [key, value] of Object.entries(signed)) {
		form.append(key, value);
	}

	const cloudinaryResponse = await runRawApi<{ url: string }, FormData>(url, 'POST', {}, form);
	return json({ url: cloudinaryResponse });
};

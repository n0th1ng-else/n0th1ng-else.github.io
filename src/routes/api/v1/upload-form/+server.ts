import { error } from '@sveltejs/kit';
import { CloudinaryResource, getUrl, signPayload } from '$lib/server/cloudinary';
import type { BaseCloudinaryPayload } from '$lib/server/cloudinary';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	try {
		// TODO read env properly. most likely does not work
		const api = {
			account: process.env.CLOUDINARY_ACCOUNT || '',
			key: process.env.CLOUDINARY_KEY || '',
			secret: process.env.CLOUDINARY_SECRET || ''
		};
		const hasAccess = Object.values(api).filter(Boolean).length === Object.values(api).length;

		if (!hasAccess) {
			throw error(401, 'Command not available');
		}

		const payload: BaseCloudinaryPayload = {
			api_key: api.key,
			timestamp: new Date().getTime(),
			resource_type: CloudinaryResource.Image,
			folder: 'blog'
		};

		const url = getUrl(api.account, CloudinaryResource.Image);
		const signed = signPayload(payload, api.secret);

		return new Response(JSON.stringify({ url, payload: signed }));
	} catch (e) {
		throw error(500, 'Something went wrong');
	}
};

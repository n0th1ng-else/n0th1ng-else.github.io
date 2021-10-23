import type { RequestHandler } from '@sveltejs/kit';
import {
	BaseCloudinaryPayload,
	CloudinaryResource,
	getUrl,
	signPayload
} from '../../../helpers/cloudinary';
import type { SignatureResponse } from '../../../types/api';

const api = {
	account: process.env.CLOUDINARY_ACCOUNT || '',
	key: process.env.CLOUDINARY_KEY || '',
	secret: process.env.CLOUDINARY_SECRET || ''
};

// @ts-expect-error finite interface CAN NOT have index signature
export const get: RequestHandler<void, null, SignatureResponse> = () => {
	const hasAccess = Object.values(api).filter(Boolean).length === Object.values(api).length;

	if (!hasAccess) {
		return {
			status: 500,
			body: {
				message: 'No access token found'
			}
		};
	}

	const payload: BaseCloudinaryPayload = {
		api_key: api.key,
		timestamp: new Date().getTime(),
		resource_type: CloudinaryResource.Image,
		folder: 'blog'
	};

	return {
		body: {
			url: getUrl(api.account, CloudinaryResource.Image),
			payload: signPayload(payload, api.secret)
		}
	};
};

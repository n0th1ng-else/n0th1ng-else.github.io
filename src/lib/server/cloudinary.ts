import { createHash } from 'crypto';
import { sortAsText } from '$lib/common/sort';
import { getUrlPrefix } from '$lib/common/api';

const generateSha1Hash = (data: string): string => {
	const sha = createHash('sha1');
	sha.update(data);
	return sha.digest('hex');
};

export enum CloudinaryResource {
	Image = 'image',
	Raw = 'raw',
	Video = 'video',
	Auto = 'auto'
}

export interface BaseCloudinaryPayload {
	api_key: string;
	cloud_name?: string;
	resource_type: CloudinaryResource;
	timestamp: number;
	public_id?: string;
	eager?: string;
	upload_preset: string;
}

export interface SignedCloudinaryPayload extends BaseCloudinaryPayload {
	signature: string;
}

export const signPayload = (
	payload: BaseCloudinaryPayload,
	secret: string
): SignedCloudinaryPayload => {
	const omitted = ['cloud_name', 'resource_type', 'api_key'];
	const pairs: string[] = [];
	for (const [key, value] of Object.entries(payload)) {
		if (!omitted.includes(key)) {
			pairs.push(`${key}=${value}`);
		}
	}

	const flat = sortAsText(pairs).join('&');
	const full = `${flat}${secret}`;
	return {
		...payload,
		signature: generateSha1Hash(full)
	};
};

export const getUrl = (account: string, type: CloudinaryResource): string =>
	getUrlPrefix(`api.cloudinary.com/v1_1/${account}/${type}/upload`);

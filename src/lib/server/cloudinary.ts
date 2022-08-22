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
	folder: string;
}

export interface SignedCloudinaryPayload extends BaseCloudinaryPayload {
	signature: string;
}

export interface CloudinaryPayload extends SignedCloudinaryPayload {
	file: File;
}

export const signPayload = (
	payload: BaseCloudinaryPayload,
	secret: string
): SignedCloudinaryPayload => {
	const { cloud_name: _c, resource_type: _r, api_key: _a, ...rest } = payload;
	const flat = sortAsText(Object.keys(rest))
		.map(field => `${field}=${payload[field]}`)
		.join('&');
	const full = `${flat}${secret}`;
	return {
		...payload,
		signature: generateSha1Hash(full)
	};
};

export const getUrl = (account: string, type: CloudinaryResource): string =>
	getUrlPrefix(`api.cloudinary.com/v1_1/${account}/${type}/upload`);

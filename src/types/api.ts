import type { SignedCloudinaryPayload } from '../helpers/cloudinary';

export interface SignatureResponse {
	url: string;
	payload: SignedCloudinaryPayload;
}

export interface Version {
	version: string;
	build: string;
}

export interface WithPagination<Item> {
	page: number;
	pageSize: number;
	items: Item[];
	total: number;
}

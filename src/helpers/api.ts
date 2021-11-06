import type { CloudinaryPayload } from './cloudinary';
import type { SignatureResponse, Version } from '../types/api';
import type { MetaInfo, LinkInfo, ProfileAccounts } from '../../common';

const getApiPath = (path: string) => `/api/v1/${path}`;

export const convertMarkdown = (content: string): Promise<string> =>
	fetch(getApiPath('markdown'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: content
		})
	})
		.then(result => result.json())
		.then(({ result }) => result);

export const getSignature = (): Promise<SignatureResponse> =>
	fetch(getApiPath('upload-form')).then(result => result.json());

export const uploadImage = (data: SignatureResponse, file: File): Promise<string> => {
	if (!data.url) {
		return Promise.reject(new Error('Upload form is invalid'));
	}
	const { url, payload } = data;
	const body: CloudinaryPayload = {
		file,
		...payload
	};
	const form = new FormData();
	Object.keys(body).forEach(item => {
		form.append(item, body[item]);
	});
	return fetch(url, { method: 'POST', body: form })
		.then(result => result.json())
		.then(result => {
			const imageUrl = result.url;
			if (!imageUrl) {
				throw new Error('Something went wrong');
			}

			return imageUrl;
		});
};

export const getProfile = (): Promise<MetaInfo> =>
	fetch(getApiPath('profile')).then(result => result.json());

export const getPackages = (): Promise<LinkInfo[]> =>
	fetch(getApiPath('packages')).then(result => result.json());

export const getArticles = (): Promise<LinkInfo[]> =>
	fetch(getApiPath('articles')).then(result => result.json());

export const getAccounts = (): Promise<ProfileAccounts> =>
	fetch(getApiPath('accounts')).then(result => result.json());

export const getVersion = (): Promise<Version> =>
	fetch(getApiPath('version')).then(result => result.json());

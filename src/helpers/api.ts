import type { CloudinaryPayload } from './cloudinary';
import type { SignatureResponse, Version } from '../types/api';
import type { MetaInfo, LinkInfo, ProfileAccounts } from '../../common';

const runApi = <Req, Res>(
	url: string,
	method: 'POST' | 'GET' = 'GET',
	body?: Req
): Promise<Res> => {
	return fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return response.json();
	});
};

const getApiPath = (path: string, pageUrl?: string): string => {
	const url = pageUrl ? `${pageUrl}/api/v1/${path}` : `/api/v1/${path}`;
	return url.startsWith('http') ? url : `https://${url}`;
};

export const convertMarkdown = (data: string): Promise<string> =>
	fetch(getApiPath('markdown'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data
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

export const getArticles = (showDraft = false): Promise<LinkInfo[]> =>
	fetch(getApiPath(`articles?draft=${showDraft}`)).then(result => result.json());

export const getArticle = (pageUrl: string, slug: string, showDraft = false): Promise<LinkInfo> =>
	runApi(getApiPath(`articles/${slug}?draft=${showDraft}`, pageUrl));

export const getAccounts = (): Promise<ProfileAccounts> =>
	fetch(getApiPath('accounts')).then(result => result.json());

export const getVersion = (): Promise<Version> =>
	fetch(getApiPath('version')).then(result => result.json());

import type { CloudinaryPayload } from './cloudinary';
import type { SignatureResponse, Version } from '../types/api';
import type { MetaInfo, LinkInfo, ProfileAccounts } from '../../common';

const runApi = <Req = unknown, Res = unknown>(
	url: string,
	method: 'POST' | 'GET' = 'GET',
	body?: Req
): Promise<Res> =>
	fetch(url, {
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

const getApiPath = (path: string, pageUrl?: string): string => {
	const url = pageUrl ? `${pageUrl}/api/v1/${path}` : `/api/v1/${path}`;
	if (url.startsWith('http')) {
		return url;
	}
	return url.includes('localhost') ? `http://${url}` : `https://${url}`;
};

const withQuery = (url: string, params: Record<string, unknown>): string => {
	const q = Object.keys(params)
		.filter(key => params[key])
		.map(key => `${key}=${params[key]}`)
		.join('&');
	return `${url}?${q}`;
};

// Browser API ----------------------------------------------------------------
export const convertMarkdown = (data: string): Promise<string> =>
	runApi<string, { result: string }>(getApiPath('markdown'), 'POST', data).then(
		({ result }) => result
	);

export const getSignature = (): Promise<SignatureResponse> => runApi(getApiPath('upload-form'));

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
	return runApi<FormData, { url: string }>(url, 'POST', form).then(result => {
		const imageUrl = result.url;
		if (!imageUrl) {
			throw new Error('Something went wrong');
		}

		return imageUrl;
	});
};

// Server API ----------------------------------------------------------------
export const getProfile = (host: string): Promise<MetaInfo> => runApi(getApiPath('profile', host));

export const getPackages = (host: string): Promise<LinkInfo[]> =>
	runApi(getApiPath('packages', host));

export const getArticles = (host: string, draft?: boolean): Promise<LinkInfo[]> =>
	runApi(withQuery(getApiPath(`articles`, host), { draft }));

export const getArticle = (host: string, slug: string, draft?: boolean): Promise<LinkInfo> =>
	runApi(withQuery(getApiPath(`articles/${slug}`, host), { draft }));

export const getAccounts = (host: string): Promise<ProfileAccounts> =>
	runApi(getApiPath('accounts', host));

export const getVersion = (host: string): Promise<Version> => runApi(getApiPath('version', host));

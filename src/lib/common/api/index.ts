import type { MetaInfo, LinkInfo, ProfileAccounts } from '../@types/common';
import type { CloudinaryPayload } from '$lib/server/cloudinary';
import type { SignatureResponse, Version } from './types';
import type { WithPagination } from '../types';

interface RequestConfig {
	type: 'json' | 'text';
}

export const runApi = <Res = unknown, Req = unknown>(
	url: string,
	method: 'POST' | 'GET' = 'GET',
	body?: Req,
	opts?: RequestConfig
): Promise<Res> => {
	const isText = opts?.type === 'text';
	return fetch(url, {
		method,
		headers: {
			'Content-Type': isText ? 'text/plain' : 'application/json'
		},
		body: isText ? body.toString() : JSON.stringify(body)
	}).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return response.json();
	});
};

const getApiPath = (path: string, pageUrl?: string): string => {
	const fullPath = `/api/v1/${path}`;
	if (!pageUrl) {
		return fullPath;
	}
	return `${getUrlPrefix(pageUrl)}${fullPath}`;
};

export const getUrlPrefix = (url: string): string => {
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
	return q ? `${url}?${q}` : url;
};

// Browser API ----------------------------------------------------------------
export const convertMarkdown = (data: string): Promise<string> =>
	runApi<{ result: string }, string>(getApiPath('markdown'), 'POST', data, { type: 'text' }).then(
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
	return runApi<{ url: string }, FormData>(url, 'POST', form).then(result => {
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

export const getArticles = (host: string, draft?: boolean): Promise<WithPagination<LinkInfo>> =>
	runApi(withQuery(getApiPath(`articles`, host), { draft }));

export const getArticle = (host: string, slug: string, draft?: boolean): Promise<LinkInfo> =>
	runApi(withQuery(getApiPath(`articles/${slug}`, host), { draft }));

export const getAccounts = (host: string): Promise<ProfileAccounts> =>
	runApi(getApiPath('accounts', host));

export const getVersion = (host: string): Promise<Version> => runApi(getApiPath('version', host));

import type { SignedCloudinaryPayload } from '$lib/server/cloudinary';

export interface SignatureResponse {
	url: string;
	payload: SignedCloudinaryPayload;
}

export interface Version {
	version: string;
	versionBuild: string;
}

export enum ApplicationStatus {
	OK = 'OK'
}

export interface StatusDto {
	status: ApplicationStatus;
	version: string;
	uptime: string;
}

import type { SignedCloudinaryPayload } from '../helpers/cloudinary';

export interface SignatureResponse {
	url: string;
	payload: SignedCloudinaryPayload;
}

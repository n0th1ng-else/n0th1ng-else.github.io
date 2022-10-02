import { getSignature, uploadImage as upload } from '$lib/common/api';

export const uploadImage = (file: File): Promise<string> => {
	return getSignature().then(data => upload(data, file));
};

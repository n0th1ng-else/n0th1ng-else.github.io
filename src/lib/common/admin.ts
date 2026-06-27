import { z } from 'zod';

// OAuth state used to start the owner login flow through the shared /api/v1/oauth callback.
export const AdminLoginStateSchema = z
	.object({
		action: z.literal('ADMIN_LOGIN')
	})
	.describe('Admin login state schema');

export type AdminLoginState = z.infer<typeof AdminLoginStateSchema>;

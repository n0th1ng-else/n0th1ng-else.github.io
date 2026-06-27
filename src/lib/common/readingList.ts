import { z } from 'zod';

export const ReadingListItemStateSchema = z
	.object({
		action: z.literal('READS'),
		url: z.string(),
		note: z.string().optional()
	})
	.describe('The follower state for reading list schema');

export type ReadingListItemState = z.infer<typeof ReadingListItemStateSchema>;

export const ReadingListItemSchema = z
	.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),
		url: z.string(),
		note: z.string().optional(),
		date: z.number()
	})
	.describe('Reading list item descriptor');

export type ReadingListItem = z.infer<typeof ReadingListItemSchema>;

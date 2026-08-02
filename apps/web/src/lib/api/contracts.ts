import { z } from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  telegram_user_id: z.number().int().positive(),
  username: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  language_code: z.string().nullable(),
  is_premium: z.boolean().nullable(),
  photo_url: z.url().nullable(),
  verified: z.boolean(),
  authentication_mode: z.enum(['telegram', 'browser_mock']),
});

export const taskSchema = z.object({
  id: z.uuid(),
  text: z.string().min(1).max(500),
  is_completed: z.boolean(),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
  completed_at: z.iso.datetime({ offset: true }).nullable(),
});

export const taskListSchema = z.object({
  items: z.array(taskSchema),
  total: z.number().int().nonnegative(),
});

export const errorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    request_id: z.string(),
    details: z.unknown().nullable(),
  }),
});

export type AuthenticatedUser = z.infer<typeof userSchema>;
export type Task = z.infer<typeof taskSchema>;
export type TaskList = z.infer<typeof taskListSchema>;
export type TaskFilter = 'all' | 'open' | 'done';

export interface TaskCreateInput {
  text: string;
}

export interface TaskUpdateInput {
  text?: string;
  is_completed?: boolean;
}

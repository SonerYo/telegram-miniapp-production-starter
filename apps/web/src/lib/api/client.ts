import type { ZodType } from 'zod';

import type { TelegramRuntimeAdapter } from '@/lib/telegram/types';

import {
  errorSchema,
  taskListSchema,
  taskSchema,
  userSchema,
  type AuthenticatedUser,
  type Task,
  type TaskCreateInput,
  type TaskFilter,
  type TaskList,
  type TaskUpdateInput,
} from './contracts';

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
    readonly requestId: string | null,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export interface ApiClient {
  getMe(signal?: AbortSignal): Promise<AuthenticatedUser>;
  listTasks(filter: TaskFilter, signal?: AbortSignal): Promise<TaskList>;
  createTask(input: TaskCreateInput): Promise<Task>;
  updateTask(taskId: string, input: TaskUpdateInput): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
}

class HttpApiClient implements ApiClient {
  constructor(
    private readonly runtime: TelegramRuntimeAdapter,
    private readonly baseUrl: string,
  ) {}

  getMe(signal?: AbortSignal): Promise<AuthenticatedUser> {
    return this.request('/v1/me', userSchema, signal ? { signal } : {});
  }

  listTasks(filter: TaskFilter, signal?: AbortSignal): Promise<TaskList> {
    return this.request(`/v1/tasks?status=${filter}`, taskListSchema, signal ? { signal } : {});
  }

  createTask(input: TaskCreateInput): Promise<Task> {
    return this.request('/v1/tasks', taskSchema, { method: 'POST', body: input });
  }

  updateTask(taskId: string, input: TaskUpdateInput): Promise<Task> {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}`, taskSchema, {
      method: 'PATCH',
      body: input,
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request(`/v1/tasks/${encodeURIComponent(taskId)}`, null, { method: 'DELETE' });
  }

  private async request<T>(
    path: string,
    schema: ZodType<T> | null,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      body?: unknown;
      signal?: AbortSignal;
    },
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    const abort = () => controller.abort();
    options.signal?.addEventListener('abort', abort, { once: true });
    const headers = new Headers({ 'X-Request-ID': crypto.randomUUID() });
    if (options.body !== undefined) headers.set('Content-Type', 'application/json');
    if (this.runtime.isTelegramRuntime) {
      headers.set('Authorization', `tma ${this.runtime.initData}`);
    } else if (import.meta.env.DEV) {
      headers.set('X-Dev-User', 'browser-mock');
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers,
        signal: controller.signal,
        credentials: 'same-origin',
        ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      });
      if (!response.ok) {
        const errorPayload: unknown = await response.json().catch(() => null);
        const parsed = errorSchema.safeParse(errorPayload);
        throw new ApiClientError(
          parsed.success ? parsed.data.error.message : 'The server returned an unexpected error.',
          parsed.success ? parsed.data.error.code : 'unexpected_response',
          response.status,
          parsed.success ? parsed.data.error.request_id : response.headers.get('X-Request-ID'),
        );
      }
      if (schema === null) return undefined as T;
      const payload: unknown = await response.json().catch(() => null);
      const parsed = schema.safeParse(payload);
      if (!parsed.success) {
        throw new ApiClientError(
          'The server response did not match the API contract.',
          'invalid_response',
          502,
          response.headers.get('X-Request-ID'),
        );
      }
      return parsed.data;
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      if (controller.signal.aborted) {
        throw new ApiClientError(
          'The request timed out or was cancelled.',
          'request_aborted',
          0,
          null,
        );
      }
      throw new ApiClientError('Starter Space could not reach the API.', 'network_error', 0, null);
    } finally {
      window.clearTimeout(timeout);
      options.signal?.removeEventListener('abort', abort);
    }
  }
}

export async function createApiClient(runtime: TelegramRuntimeAdapter): Promise<ApiClient> {
  if (import.meta.env.DEV && (import.meta.env.VITE_API_MODE ?? 'mock') === 'mock') {
    const { mockApiClient } = await import('@/mocks/mock-api');
    return mockApiClient;
  }
  return new HttpApiClient(runtime, import.meta.env.VITE_API_BASE_URL ?? '/api');
}

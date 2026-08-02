import { afterEach, describe, expect, it, vi } from 'vitest';

import type { TelegramRuntimeAdapter } from '@/lib/telegram/types';

import { ApiClientError, createApiClient } from './client';

const USER = {
  id: '10000000-0000-4000-8000-000000000001',
  telegram_user_id: 42,
  username: 'test_user',
  first_name: 'Test',
  last_name: null,
  language_code: 'en',
  is_premium: false,
  photo_url: null,
  verified: true,
  authentication_mode: 'telegram',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('typed API client', () => {
  it('injects Telegram init data and validates a successful payload', async () => {
    vi.stubEnv('VITE_API_MODE', 'http');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(USER), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const client = await createApiClient(runtime(true));
    await expect(client.getMe()).resolves.toMatchObject({ telegram_user_id: 42 });
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(request.headers).get('Authorization')).toBe('tma signed-init-data');
    expect(request.credentials).toBe('same-origin');
  });

  it('maps the stable backend error contract', async () => {
    vi.stubEnv('VITE_API_MODE', 'http');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'task_not_found',
              message: 'Task not found.',
              request_id: 'request-1',
              details: null,
            },
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
    const client = await createApiClient(runtime(false));
    await expect(client.updateTask(crypto.randomUUID(), { text: 'Update' })).rejects.toMatchObject({
      code: 'task_not_found',
      status: 404,
      requestId: 'request-1',
    });
  });

  it('rejects an invalid success payload and normalizes network failures', async () => {
    vi.stubEnv('VITE_API_MODE', 'http');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ unexpected: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockRejectedValueOnce(new TypeError('offline'));
    vi.stubGlobal('fetch', fetchMock);
    const client = await createApiClient(runtime(false));
    await expect(client.getMe()).rejects.toBeInstanceOf(ApiClientError);
    await expect(client.listTasks('all')).rejects.toMatchObject({ code: 'network_error' });
  });
});

function runtime(telegram: boolean): TelegramRuntimeAdapter {
  return {
    kind: telegram ? 'telegram' : 'browser-mock',
    isTelegramRuntime: telegram,
    initData: telegram ? 'signed-init-data' : '',
    getSnapshot: vi.fn(),
    subscribe: vi.fn(),
    ready: vi.fn(),
    expand: vi.fn(),
    showBackButton: vi.fn(),
    configureMainButton: vi.fn(),
    haptic: vi.fn(),
    setClosingConfirmation: vi.fn(),
    openExternalLink: vi.fn(),
    openTelegramLink: vi.fn(),
  };
}

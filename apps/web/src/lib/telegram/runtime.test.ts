import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTelegramRuntime, isSafeExternalUrl, subscribeToTelegramEvent } from './runtime';
import type { TelegramEvent, TelegramEventHandler, TelegramWebApp } from './types';

afterEach(() => {
  delete window.Telegram;
});

describe('runtime selection', () => {
  it('uses the explicit browser mock outside Telegram during development', async () => {
    const runtime = await createTelegramRuntime();
    expect(runtime.kind).toBe('browser-mock');
    expect(runtime.isTelegramRuntime).toBe(false);
  });

  it('uses the official WebApp bridge when available', async () => {
    const onEvent = vi.fn<(event: TelegramEvent, callback: TelegramEventHandler) => void>();
    const webApp = fakeWebApp(onEvent);
    window.Telegram = { WebApp: webApp };
    const runtime = await createTelegramRuntime();
    expect(runtime.kind).toBe('telegram');
    expect(runtime.initData).toBe('signed-query');
    runtime.ready();
    runtime.expand();
    expect(webApp.ready).toHaveBeenCalledOnce();
    expect(webApp.expand).toHaveBeenCalledOnce();
    expect(onEvent).toHaveBeenCalled();

    const changed = vi.fn();
    const stop = runtime.subscribe(changed);
    const themeCallback = onEvent.mock.calls.find(([event]) => event === 'themeChanged')?.[1];
    themeCallback?.();
    expect(changed).toHaveBeenCalledOnce();
    stop();

    const backHandler = vi.fn();
    const hideBack = runtime.showBackButton(backHandler);
    expect(webApp.BackButton.show).toHaveBeenCalledOnce();
    hideBack();
    expect(webApp.BackButton.hide).toHaveBeenCalledOnce();

    const mainHandler = vi.fn();
    const hideMain = runtime.configureMainButton({
      text: 'Save',
      visible: true,
      enabled: true,
      loading: true,
      onClick: mainHandler,
    });
    hideMain();
    runtime.configureMainButton({
      text: 'Hidden',
      visible: false,
      enabled: false,
      loading: false,
      onClick: mainHandler,
    })();
    expect(webApp.MainButton.setText).toHaveBeenCalledWith('Save');
    expect(webApp.MainButton.showProgress).toHaveBeenCalledWith(true);

    runtime.haptic('selection');
    runtime.haptic('success');
    runtime.setClosingConfirmation(true);
    runtime.setClosingConfirmation(false);
    runtime.openExternalLink('https://example.org');
    runtime.openTelegramLink('https://t.me/example');
    expect(webApp.enableClosingConfirmation).toHaveBeenCalledOnce();
    expect(webApp.disableClosingConfirmation).toHaveBeenCalledOnce();
  });

  it('validates external links and cleans event subscriptions', () => {
    expect(isSafeExternalUrl('https://example.org/guide')).toBe(true);
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
    const webApp = fakeWebApp(vi.fn());
    const handler: TelegramEventHandler = vi.fn();
    const cleanup = subscribeToTelegramEvent(webApp, 'themeChanged', handler);
    cleanup();
    expect(webApp.offEvent).toHaveBeenCalledWith('themeChanged', handler);
  });
});

function fakeWebApp(
  onEvent: (event: TelegramEvent, callback: TelegramEventHandler) => void = vi.fn(),
): TelegramWebApp {
  return {
    initData: 'signed-query',
    initDataUnsafe: { user: { id: 1, first_name: 'Test' } },
    colorScheme: 'light',
    themeParams: {},
    viewportHeight: 800,
    viewportStableHeight: 780,
    isExpanded: true,
    BackButton: { show: vi.fn(), hide: vi.fn(), onClick: vi.fn(), offClick: vi.fn() },
    MainButton: {
      setText: vi.fn(),
      show: vi.fn(),
      hide: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn(),
      showProgress: vi.fn(),
      hideProgress: vi.fn(),
      onClick: vi.fn(),
      offClick: vi.fn(),
    },
    HapticFeedback: {
      impactOccurred: vi.fn(),
      notificationOccurred: vi.fn(),
      selectionChanged: vi.fn(),
    },
    ready: vi.fn(),
    expand: vi.fn(),
    enableClosingConfirmation: vi.fn(),
    disableClosingConfirmation: vi.fn(),
    openLink: vi.fn(),
    openTelegramLink: vi.fn(),
    onEvent,
    offEvent: vi.fn(),
  };
}

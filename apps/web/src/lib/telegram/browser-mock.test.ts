import { describe, expect, it, vi } from 'vitest';

import { BrowserMockRuntime } from './browser-mock';

describe('BrowserMockRuntime', () => {
  it('models theme, safe areas, subscriptions, and BackButton events', () => {
    const runtime = new BrowserMockRuntime();
    const changed = vi.fn();
    const back = vi.fn();
    const unsubscribe = runtime.subscribe(changed);
    const hideBack = runtime.showBackButton(back);

    runtime.setMockTheme('dark');
    runtime.setMockSafeArea(24, 18);
    runtime.emitMockBack();

    expect(runtime.getSnapshot().colorScheme).toBe('dark');
    expect(runtime.getSnapshot().viewport.safeAreaInset).toMatchObject({ top: 24, bottom: 18 });
    expect(changed).toHaveBeenCalledTimes(2);
    expect(back).toHaveBeenCalledOnce();

    runtime.ready();
    runtime.expand();
    runtime.configureMainButton({
      text: 'Save',
      visible: true,
      enabled: true,
      onClick: vi.fn(),
    })();
    runtime.haptic('success');
    runtime.setClosingConfirmation(true);

    unsubscribe();
    hideBack();
    runtime.emitMockBack();
    expect(back).toHaveBeenCalledOnce();
  });
});

import type { ColorScheme, TelegramRuntimeAdapter, TelegramRuntimeSnapshot } from './types';

export class BrowserMockRuntime implements TelegramRuntimeAdapter {
  readonly kind = 'browser-mock' as const;
  readonly isTelegramRuntime = false;
  readonly initData = '';
  private readonly listeners = new Set<() => void>();
  private readonly backHandlers = new Set<() => void>();
  private snapshot: TelegramRuntimeSnapshot = {
    kind: this.kind,
    colorScheme: 'light',
    themeParams: {},
    viewport: {
      height: window.innerHeight,
      stableHeight: window.innerHeight,
      isExpanded: true,
      isVerticalSwipesEnabled: true,
      safeAreaInset: { top: 0, bottom: 16, left: 0, right: 0 },
      contentSafeAreaInset: { top: 0, bottom: 8, left: 0, right: 0 },
    },
    unverifiedUser: {
      id: 9_000_000_001,
      first_name: 'Avery',
      last_name: 'Starter',
      username: 'browser_mock',
      language_code: 'en',
    },
  };

  getSnapshot = (): TelegramRuntimeSnapshot => this.snapshot;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  ready(): void {
    return undefined;
  }
  expand(): void {
    return undefined;
  }
  showBackButton(handler: () => void): () => void {
    this.backHandlers.add(handler);
    return () => this.backHandlers.delete(handler);
  }
  configureMainButton(options: {
    text: string;
    visible: boolean;
    enabled: boolean;
    loading?: boolean;
    onClick: () => void;
  }): () => void {
    void options;
    return () => undefined;
  }
  haptic(type: 'selection' | 'success' | 'warning' | 'error'): void {
    void type;
    return undefined;
  }
  setClosingConfirmation(enabled: boolean): void {
    void enabled;
    return undefined;
  }
  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  openTelegramLink(url: string): void {
    if (url.startsWith('https://t.me/')) window.location.assign(url);
  }
  setMockTheme(scheme: ColorScheme): void {
    this.snapshot = { ...this.snapshot, colorScheme: scheme };
    this.emit();
  }
  setMockSafeArea(top: number, bottom: number): void {
    this.snapshot = {
      ...this.snapshot,
      viewport: {
        ...this.snapshot.viewport,
        safeAreaInset: { top, bottom, left: 0, right: 0 },
        contentSafeAreaInset: { top: Math.max(0, top - 4), bottom, left: 0, right: 0 },
      },
    };
    this.emit();
  }
  emitMockBack(): void {
    this.backHandlers.forEach((handler) => handler());
  }
  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

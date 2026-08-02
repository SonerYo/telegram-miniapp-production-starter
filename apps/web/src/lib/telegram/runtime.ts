import type {
  TelegramEvent,
  TelegramEventHandler,
  TelegramRuntimeAdapter,
  TelegramRuntimeSnapshot,
  TelegramWebApp,
  ViewportState,
} from './types';

const ZERO_INSET = { top: 0, bottom: 0, left: 0, right: 0 };

function viewportFromWebApp(webApp: TelegramWebApp): ViewportState {
  return {
    height: webApp.viewportHeight || window.innerHeight,
    stableHeight: webApp.viewportStableHeight || window.innerHeight,
    isExpanded: webApp.isExpanded,
    isVerticalSwipesEnabled: webApp.isVerticalSwipesEnabled ?? true,
    safeAreaInset: webApp.safeAreaInset ?? ZERO_INSET,
    contentSafeAreaInset: webApp.contentSafeAreaInset ?? ZERO_INSET,
  };
}

class OfficialTelegramRuntime implements TelegramRuntimeAdapter {
  readonly kind = 'telegram' as const;
  readonly isTelegramRuntime = true;
  private readonly listeners = new Set<() => void>();
  private readonly eventHandler: TelegramEventHandler = () => this.emit();

  constructor(private readonly webApp: TelegramWebApp) {
    for (const event of [
      'themeChanged',
      'viewportChanged',
      'safeAreaChanged',
      'contentSafeAreaChanged',
    ] as const) {
      this.webApp.onEvent(event, this.eventHandler);
    }
  }

  get initData(): string {
    return this.webApp.initData;
  }

  getSnapshot = (): TelegramRuntimeSnapshot => ({
    kind: this.kind,
    colorScheme: this.webApp.colorScheme,
    themeParams: this.webApp.themeParams,
    viewport: viewportFromWebApp(this.webApp),
    unverifiedUser: this.webApp.initDataUnsafe?.user ?? null,
  });

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  ready(): void {
    this.webApp.ready();
  }

  expand(): void {
    this.webApp.expand();
  }

  showBackButton(handler: () => void): () => void {
    this.webApp.BackButton.show();
    this.webApp.BackButton.onClick(handler);
    return () => {
      this.webApp.BackButton.offClick(handler);
      this.webApp.BackButton.hide();
    };
  }

  configureMainButton(options: {
    text: string;
    visible: boolean;
    enabled: boolean;
    loading?: boolean;
    onClick: () => void;
  }): () => void {
    const button = this.webApp.MainButton;
    button.setText(options.text);
    if (options.visible) button.show();
    else button.hide();
    if (options.enabled) button.enable();
    else button.disable();
    if (options.loading) button.showProgress(true);
    else button.hideProgress();
    button.onClick(options.onClick);
    return () => {
      button.offClick(options.onClick);
      button.hideProgress();
      button.hide();
    };
  }

  haptic(type: 'selection' | 'success' | 'warning' | 'error'): void {
    if (type === 'selection') {
      this.webApp.HapticFeedback?.selectionChanged();
    } else {
      this.webApp.HapticFeedback?.notificationOccurred(type);
    }
  }

  setClosingConfirmation(enabled: boolean): void {
    if (enabled) this.webApp.enableClosingConfirmation();
    else this.webApp.disableClosingConfirmation();
  }

  openExternalLink(url: string): void {
    this.webApp.openLink(url);
  }

  openTelegramLink(url: string): void {
    this.webApp.openTelegramLink(url);
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

class UnavailableRuntime implements TelegramRuntimeAdapter {
  readonly kind = 'unavailable' as const;
  readonly isTelegramRuntime = false;
  readonly initData = '';
  private readonly snapshot: TelegramRuntimeSnapshot = {
    kind: this.kind,
    colorScheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    themeParams: {},
    viewport: {
      height: window.innerHeight,
      stableHeight: window.innerHeight,
      isExpanded: true,
      isVerticalSwipesEnabled: true,
      safeAreaInset: ZERO_INSET,
      contentSafeAreaInset: ZERO_INSET,
    },
    unverifiedUser: null,
  };

  getSnapshot = (): TelegramRuntimeSnapshot => this.snapshot;
  subscribe = (): (() => void) => () => undefined;
  ready(): void {
    return undefined;
  }
  expand(): void {
    return undefined;
  }
  showBackButton(handler: () => void): () => void {
    void handler;
    return () => undefined;
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
}

function getOfficialWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null;
}

export async function createTelegramRuntime(): Promise<TelegramRuntimeAdapter> {
  const webApp = getOfficialWebApp();
  if (webApp) return new OfficialTelegramRuntime(webApp);
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_BROWSER_MOCK !== 'false') {
    const { BrowserMockRuntime } = await import('./browser-mock');
    const runtime = new BrowserMockRuntime();
    window.__STARTER_MOCK_RUNTIME__ = runtime;
    return runtime;
  }
  return new UnavailableRuntime();
}

export function isSafeExternalUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function subscribeToTelegramEvent(
  webApp: TelegramWebApp,
  event: TelegramEvent,
  handler: TelegramEventHandler,
): () => void {
  webApp.onEvent(event, handler);
  return () => webApp.offEvent(event, handler);
}

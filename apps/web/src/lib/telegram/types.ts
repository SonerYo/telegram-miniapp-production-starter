export type ColorScheme = 'light' | 'dark';

export interface TelegramUserPreview {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface ThemeParams {
  bg_color?: string;
  secondary_bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  header_bg_color?: string;
  bottom_bar_bg_color?: string;
  accent_text_color?: string;
  destructive_text_color?: string;
  section_bg_color?: string;
  section_separator_color?: string;
  subtitle_text_color?: string;
}

export interface SafeAreaInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ViewportState {
  height: number;
  stableHeight: number;
  isExpanded: boolean;
  isVerticalSwipesEnabled: boolean;
  safeAreaInset: SafeAreaInset;
  contentSafeAreaInset: SafeAreaInset;
}

export type TelegramEvent =
  | 'themeChanged'
  | 'viewportChanged'
  | 'safeAreaChanged'
  | 'contentSafeAreaChanged'
  | 'backButtonClicked'
  | 'mainButtonClicked';

export type TelegramEventHandler = (...args: unknown[]) => void;

export interface TelegramBackButton {
  isVisible?: boolean;
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
}

export interface TelegramMainButton {
  setText(text: string): void;
  show(): void;
  hide(): void;
  enable(): void;
  disable(): void;
  showProgress(leaveActive?: boolean): void;
  hideProgress(): void;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
}

export interface TelegramHapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
  notificationOccurred(type: 'error' | 'success' | 'warning'): void;
  selectionChanged(): void;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: TelegramUserPreview };
  colorScheme: ColorScheme;
  themeParams: ThemeParams;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  isVerticalSwipesEnabled?: boolean;
  safeAreaInset?: SafeAreaInset;
  contentSafeAreaInset?: SafeAreaInset;
  BackButton: TelegramBackButton;
  MainButton: TelegramMainButton;
  HapticFeedback?: TelegramHapticFeedback;
  ready(): void;
  expand(): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  onEvent(event: TelegramEvent, callback: TelegramEventHandler): void;
  offEvent(event: TelegramEvent, callback: TelegramEventHandler): void;
}

export interface TelegramRuntimeSnapshot {
  kind: 'telegram' | 'browser-mock' | 'unavailable';
  colorScheme: ColorScheme;
  themeParams: ThemeParams;
  viewport: ViewportState;
  unverifiedUser: TelegramUserPreview | null;
}

export interface TelegramRuntimeAdapter {
  readonly kind: TelegramRuntimeSnapshot['kind'];
  readonly isTelegramRuntime: boolean;
  readonly initData: string;
  getSnapshot(): TelegramRuntimeSnapshot;
  subscribe(listener: () => void): () => void;
  ready(): void;
  expand(): void;
  showBackButton(handler: () => void): () => void;
  configureMainButton(options: {
    text: string;
    visible: boolean;
    enabled: boolean;
    loading?: boolean;
    onClick: () => void;
  }): () => void;
  haptic(type: 'selection' | 'success' | 'warning' | 'error'): void;
  setClosingConfirmation(enabled: boolean): void;
  openExternalLink(url: string): void;
  openTelegramLink(url: string): void;
  setMockTheme?(scheme: ColorScheme): void;
  setMockSafeArea?(top: number, bottom: number): void;
  emitMockBack?(): void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
    __STARTER_MOCK_RUNTIME__?: TelegramRuntimeAdapter;
  }
}

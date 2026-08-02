import type { ViewportState } from './types';

export function applyViewport(viewport: ViewportState): void {
  const root = document.documentElement;
  root.style.setProperty('--tg-viewport-height', `${viewport.height}px`);
  root.style.setProperty('--tg-viewport-stable-height', `${viewport.stableHeight}px`);
  root.style.setProperty('--tg-safe-area-top', `${viewport.safeAreaInset.top}px`);
  root.style.setProperty('--tg-safe-area-bottom', `${viewport.safeAreaInset.bottom}px`);
  root.style.setProperty('--tg-safe-area-left', `${viewport.safeAreaInset.left}px`);
  root.style.setProperty('--tg-safe-area-right', `${viewport.safeAreaInset.right}px`);
  root.style.setProperty('--tg-content-safe-area-top', `${viewport.contentSafeAreaInset.top}px`);
  root.style.setProperty(
    '--tg-content-safe-area-bottom',
    `${viewport.contentSafeAreaInset.bottom}px`,
  );
}

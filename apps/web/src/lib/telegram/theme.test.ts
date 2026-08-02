import { describe, expect, it } from 'vitest';

import { applyTheme, themeToCssVariables } from './theme';

describe('Telegram theme mapping', () => {
  it('maps Telegram colors to semantic tokens', () => {
    const variables = themeToCssVariables(
      { bg_color: '#101010', text_color: '#fafafa', button_color: '#7654ff' },
      'dark',
    );
    expect(variables['--color-bg']).toBe('#101010');
    expect(variables['--color-text']).toBe('#fafafa');
    expect(variables['--color-accent']).toBe('#7654ff');
    expect(variables['--color-surface']).toBeTruthy();
  });

  it('applies fallbacks and document color scheme', () => {
    applyTheme({}, 'light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.getPropertyValue('--color-bg')).toBe('#f5f3ef');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});

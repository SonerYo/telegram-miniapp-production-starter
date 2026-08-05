import type { ColorScheme, ThemeParams } from './types';

const FALLBACK_LIGHT: Required<
  Pick<
    ThemeParams,
    | 'bg_color'
    | 'secondary_bg_color'
    | 'text_color'
    | 'hint_color'
    | 'button_color'
    | 'button_text_color'
  >
> = {
  bg_color: '#f5f3ef',
  secondary_bg_color: '#ffffff',
  text_color: '#1d1b24',
  hint_color: '#746f7d',
  button_color: '#6f5ce7',
  button_text_color: '#ffffff',
};

const FALLBACK_DARK: typeof FALLBACK_LIGHT = {
  bg_color: '#111017',
  secondary_bg_color: '#1c1a24',
  text_color: '#f7f5fb',
  hint_color: '#aaa5b5',
  button_color: '#9182ff',
  button_text_color: '#14111f',
};

export function themeToCssVariables(
  theme: ThemeParams,
  colorScheme: ColorScheme,
): Record<string, string> {
  const fallback = colorScheme === 'dark' ? FALLBACK_DARK : FALLBACK_LIGHT;
  const surface = theme.section_bg_color ?? theme.secondary_bg_color ?? fallback.secondary_bg_color;
  return {
    '--color-bg': theme.bg_color ?? fallback.bg_color,
    '--color-surface': surface,
    '--color-surface-raised': theme.secondary_bg_color ?? fallback.secondary_bg_color,
    '--color-text': theme.text_color ?? fallback.text_color,
    '--color-text-muted': theme.subtitle_text_color ?? theme.hint_color ?? fallback.hint_color,
    '--color-accent': theme.button_color ?? theme.link_color ?? fallback.button_color,
    '--color-accent-contrast': theme.button_text_color ?? fallback.button_text_color,
    '--color-border':
      theme.section_separator_color ?? (colorScheme === 'dark' ? '#373340' : '#e6e1ec'),
    '--color-danger':
      theme.destructive_text_color ?? (colorScheme === 'dark' ? '#ff8c96' : '#c63b4a'),
    '--color-success': colorScheme === 'dark' ? '#6ed8a8' : '#258c61',
    '--color-overlay': colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.72)' : 'rgba(24, 19, 38, 0.42)',
  };
}

export function applyTheme(theme: ThemeParams, colorScheme: ColorScheme): void {
  const root = document.documentElement;
  const variables = themeToCssVariables(theme, colorScheme);
  for (const [name, value] of Object.entries(variables)) {
    root.style.setProperty(name, value);
  }
  root.dataset.theme = colorScheme;
  root.style.colorScheme = colorScheme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', variables['--color-bg'] ?? '#f5f3ef');
}

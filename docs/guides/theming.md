# Theming and safe areas

`TelegramProvider` maps host `themeParams` into semantic CSS variables and updates the document color scheme. Components consume semantic roles such as surface, text, accent, success, danger, and outline rather than Telegram property names.

Viewport values are exposed as CSS variables. The app shell combines Telegram content/viewport inset values with browser `env(safe-area-inset-*)`. Fixed bottom navigation and sheets reserve the resulting bottom space; page content reserves navigation height.

When adding UI:

1. Reuse or add a semantic token in `src/styles/tokens.css`.
2. Keep page-specific layout in a CSS Module.
3. Test at 320, 375, 390, and 430 CSS pixels.
4. Force non-zero top and bottom safe areas in Developer Preview.
5. Check both schemes, text scaling, keyboard focus, and `prefers-reduced-motion`.

Do not assume a particular Telegram background color, hard-code viewport height, or place essential controls inside an unsafe inset.

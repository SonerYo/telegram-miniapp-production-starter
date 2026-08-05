import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/lib/telegram/theme.ts',
        'src/lib/telegram/browser-mock.ts',
        'src/lib/telegram/runtime.ts',
        'src/lib/api/client.ts',
        'src/features/tasks/TaskForm.tsx',
      ],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/lib/telegram/types.ts'],
      thresholds: {
        lines: 75,
        functions: 70,
        statements: 75,
        branches: 65,
      },
    },
  },
});

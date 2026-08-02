/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_MODE?: 'mock' | 'http';
  readonly VITE_ENABLE_BROWSER_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

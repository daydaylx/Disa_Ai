/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string;
  readonly VITE_PORT?: string;
  readonly VITE_BUILD_ID?: string;
  readonly VITE_BUILD_TIME?: string;
  readonly VITE_BUILD_TIMESTAMP?: string;
  readonly VITE_GIT_SHA?: string;
  readonly VITE_GIT_BRANCH?: string;
  readonly VITE_VERSION?: string;
  readonly VITE_UI_V2_PERCENTAGE?: string;
  readonly VITE_FORCE_UI_VERSION?: string;
  readonly VITE_OPENROUTER_BASE_URL?: string;
  // Vite builtin environment variables
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    accept(): void;
    dispose(cb: () => void): void;
  };
}

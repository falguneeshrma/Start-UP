/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_ADMIN_EMAILS?: string;
  readonly VITE_CUSTOM_PROJECT_FORM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** A preview build's own app id: `VITE_APP_ID=<previewAppId> npm run build`. */
  readonly VITE_APP_ID?: string
}

/// <reference types="vite/client" />

/** Versión de la app (version.json de la raíz). La inyecta vite.config.ts con `define` (BUILD_SPEC §8.1). */
declare const __VERSION_APP__: string;

interface ImportMetaEnv {
  /** '1' en `npm run dev:demo` (ui/.env.demo). Nunca existe en `vite build`. */
  readonly VITE_DEMO?: string;
}

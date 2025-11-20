const DEFAULT_BASE = "/";

function normalizeBase(base: string): string {
  if (!base) return DEFAULT_BASE;
  return base.endsWith("/") ? base : `${base}/`;
}

function normalizePath(path: string): string {
  if (!path) return "";
  return path.startsWith("/") ? path.slice(1) : path;
}

/**
 * Resolves a URL to a static asset inside the public/ directory while respecting Vite's base path.
 */
export function resolvePublicAssetUrl(assetPath: string): string {
  const base =
    typeof import.meta !== "undefined" ? (import.meta.env.BASE_URL ?? DEFAULT_BASE) : DEFAULT_BASE;
  return `${normalizeBase(base)}${normalizePath(assetPath)}`;
}

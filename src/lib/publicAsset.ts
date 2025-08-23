export function publicAsset(path: string): string {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const normalized = String(path).replace(/^\/+/, "");
  return new URL(base + normalized, window.location.origin).toString();
}
export function publicAsset(path: string): string {
  const base =
    (import.meta as any)?.env?.VITE_BASE_URL ??
    (import.meta as any)?.env?.BASE_URL ??
    "/";
  const normalized = String(path).replace(/^\/+/, "");
  const joined = `${String(base).replace(/\/+$/, "")}/${normalized}`;
  const origin = typeof window !== "undefined" && window.location ? window.location.origin : "";
  return `${origin}${joined}`;
}

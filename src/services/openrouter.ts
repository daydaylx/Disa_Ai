const KEY_NAME = "openrouter.api_key";

export function getOpenRouterApiKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY_NAME);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}
export function setOpenRouterApiKey(value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_NAME, value);
}
export function clearOpenRouterApiKey(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY_NAME);
}

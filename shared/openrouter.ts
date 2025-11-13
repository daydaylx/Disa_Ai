export const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
export const OPENROUTER_CHAT_PATH = "/chat/completions";
export const OPENROUTER_MODELS_PATH = "/models";

function trimTrailingSlash(input: string): string {
  return input.replace(/\/+$/, "");
}

function ensureLeadingSlash(path: string): string {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildOpenRouterUrl(base: string, path: string): string {
  const safeBase = trimTrailingSlash(base || DEFAULT_OPENROUTER_BASE_URL);
  const safePath = ensureLeadingSlash(path);
  return `${safeBase}${safePath}`;
}

import { readApiKey } from "../openrouter/key";
export const CHAT_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export function getApiKey(): string {
  // Only use secure keyStore, no localStorage fallback for API keys
  return readApiKey() || "";
}

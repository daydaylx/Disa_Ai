import { readApiKey } from "../openrouter/key";
export const CHAT_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export function getApiKey(): string {
  return (
    readApiKey() ||
    localStorage.getItem("openrouter_key") ||
    localStorage.getItem("OPENROUTER_API_KEY") ||
    ""
  );
}

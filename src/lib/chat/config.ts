export const CHAT_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
import { readApiKey } from "../openrouter/key";

export function getApiKey(): string {
  return (
    readApiKey() ||
    localStorage.getItem("openrouter_key") ||
    localStorage.getItem("OPENROUTER_API_KEY") ||
    ""
  );
}

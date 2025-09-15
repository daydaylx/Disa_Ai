import { API_CONFIG } from "../../config/defaults";
import { readApiKey } from "../openrouter/key";

export const CHAT_ENDPOINT = API_CONFIG.OPENROUTER.CHAT_ENDPOINT;

export function getApiKey(): string {
  // Only use secure keyStore, no localStorage fallback for API keys
  return readApiKey() || "";
}

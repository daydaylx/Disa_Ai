export const CHAT_FOCUS_EVENT = "disa:chat:focusInput";
export const CHAT_NEWSESSION_EVENT = "disa:chat:newSession";

export function requestChatFocus() { window.dispatchEvent(new CustomEvent(CHAT_FOCUS_EVENT)) }
export function requestNewChatSession(payload?: { templateId?: string }) {
  window.dispatchEvent(new CustomEvent(CHAT_NEWSESSION_EVENT, { detail: payload || {} }))
}

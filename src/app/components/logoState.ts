import type { LogoState } from "./AnimatedLogo";

interface ChatLogoStateInput {
  hasError: boolean;
  isLoading: boolean;
  inputValue: string;
}

/**
 * Maps chat UI state to logo animation state.
 * Keep this pure for predictable rendering and straightforward unit tests.
 */
export function getChatLogoState({
  hasError,
  isLoading,
  inputValue,
}: ChatLogoStateInput): LogoState {
  if (hasError) return "error";
  if (isLoading) return "thinking";
  if (inputValue.trim().length > 0) return "typing";
  return "idle";
}

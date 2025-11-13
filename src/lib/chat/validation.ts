// eslint-disable-next-line no-control-regex -- explicit control range is required to cleanse prompts
const CONTROL_CHAR_REGEX = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]", "g");
export const MAX_PROMPT_LENGTH = 4000;

export type PromptValidationReason = "empty" | "too_long";

export type PromptValidationResult =
  | { valid: true; sanitized: string }
  | { valid: false; sanitized: string; reason: PromptValidationReason };

export function sanitizePrompt(input: string): string {
  if (!input) return "";

  const normalizedLineEndings = input.replace(/\r\n?/g, "\n");
  const withoutControl = normalizedLineEndings.replace(CONTROL_CHAR_REGEX, "");
  const withoutNoBreakSpace = withoutControl.replace(/\u00A0/g, " ");

  return withoutNoBreakSpace.trim();
}

export function validatePrompt(input: string): PromptValidationResult {
  const sanitized = sanitizePrompt(input);

  if (!sanitized) {
    return { valid: false, sanitized: "", reason: "empty" };
  }

  if (sanitized.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      sanitized: sanitized.slice(0, MAX_PROMPT_LENGTH),
      reason: "too_long",
    };
  }

  return { valid: true, sanitized };
}

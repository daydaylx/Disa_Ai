export function escapeHtml(input: string): string {
  return input
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;")
    .replaceAll(/"/g, "&quot;")
    .replaceAll(/'/g, "&#39;");
}

/** Nur wenn du wirklich HTML brauchst – sonst immer Textknoten nutzen */
export function safeHtmlFromUserText(input: string): string {
  return escapeHtml(input).replaceAll(/\n/g, "<br/>");
}

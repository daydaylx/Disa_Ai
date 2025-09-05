export function humanError(status?: number): {
  title: string;
  message?: string;
  action?: "settings" | "retry";
} {
  switch (status) {
    case 401:
    case 403:
      return {
        title: "API-Key ungültig/fehlt",
        message: "Bitte prüfe deinen OpenRouter-Key.",
        action: "settings",
      };
    case 429:
      return {
        title: "Rate-Limit",
        message: "Zu viele Anfragen. Warte kurz und versuche es erneut.",
        action: "retry",
      };
    case 0:
      return {
        title: "Offline?",
        message: "Keine Verbindung. Prüfe dein Netzwerk.",
        action: "retry",
      };
    default:
      return {
        title: "Unerwarteter Fehler",
        message: "Etwas ist schiefgelaufen. Versuche es erneut.",
        action: "retry",
      };
  }
}

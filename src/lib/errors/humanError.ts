import {
  AbortError,
  ApiServerError,
  AuthenticationError,
  mapError,
  NetworkError,
  PermissionError,
  RateLimitError,
} from ".";

export interface HumanError {
  title: string;
  message: string;
  action?: string;
}

export function humanError(error: unknown): HumanError {
  const err = mapError(error);
  const lowerMsg = err.message.toLowerCase();

  // Authentication errors
  if (err instanceof AuthenticationError) {
    return {
      title: "Authentifizierung fehlgeschlagen",
      message: "API-Key fehlt oder ist ungültig.",
      action: "Prüfen Sie Ihren API-Key in den Einstellungen.",
    };
  }

  // Permission and access errors
  if (err instanceof PermissionError) {
    return {
      title: "Zugriff verweigert",
      message: "Das gewählte Modell ist nicht verfügbar oder blockiert.",
      action: "Wählen Sie ein anderes Modell oder prüfen Sie Ihre Berechtigung.",
    };
  }

  // Rate limiting errors
  if (err instanceof RateLimitError) {
    return {
      title: "Rate-Limit erreicht",
      message: "Zu viele Anfragen in kurzer Zeit.",
      action: "Warten Sie einen Moment und versuchen Sie es dann erneut.",
    };
  }

  // Specific OpenRouter/LLM errors (Credit/Quota)
  if (
    lowerMsg.includes("credit") ||
    lowerMsg.includes("quota") ||
    lowerMsg.includes("balance") ||
    lowerMsg.includes("payment")
  ) {
    return {
      title: "Guthaben aufgebraucht",
      message: "Das Guthaben für den API-Dienst ist erschöpft.",
      action: "Bitte API-Key prüfen oder Guthaben aufladen.",
    };
  }

  // Server errors
  if (err instanceof ApiServerError) {
    return {
      title: "Serverfehler beim Anbieter",
      message: "Der Server hatte ein Problem. Dies ist meist temporär.",
      action: "Versuchen Sie es in einigen Minuten erneut.",
    };
  }

  // Network connectivity errors
  if (err instanceof NetworkError) {
    return {
      title: "Netzwerkfehler",
      message: "Es konnte keine Verbindung zum Server hergestellt werden.",
      action: "Prüfen Sie Ihre Internetverbindung.",
    };
  }

  // User-initiated abort errors
  if (err instanceof AbortError) {
    return {
      title: "Anfrage abgebrochen",
      message: "Die Aktion wurde von Ihnen gestoppt.",
    };
  }

  // API key and proxy related errors
  if (err.message.includes("NO_API_KEY")) {
    return {
      title: "Verbindungsproblem",
      message: "Die App konnte keine Verbindung zum öffentlichen Proxy herstellen.",
      action:
        "Prüfen Sie Ihre Internetverbindung oder fügen Sie einen eigenen API-Key in den Einstellungen hinzu.",
    };
  }

  // Proxy-related errors with specific timeout handling
  if (lowerMsg.includes("stream_timeout") || lowerMsg.includes("response took too long")) {
    return {
      title: "Zeitüberschreitung",
      message: "Die KI-Antwort benötigt länger als erwartet.",
      action:
        "Bitte versuchen Sie es erneut. Wenn das Problem weiterhin besteht, fügen Sie einen eigenen API-Key hinzu.",
    };
  }

  // Enhanced proxy-related errors
  if (
    lowerMsg.includes("proxy-fehler") ||
    (lowerMsg.includes("proxy") && lowerMsg.includes("unavailable")) ||
    lowerMsg.includes("unable to reach the chat service") ||
    lowerMsg.includes("failed to reach openrouter")
  ) {
    return {
      title: "Verbindungsproblem",
      message: "Der Chat-Server ist vorübergehend nicht erreichbar.",
      action:
        "Bitte versuchen Sie es in einigen Sekunden erneut oder fügen Sie einen eigenen API-Key in den Einstellungen hinzu.",
    };
  }

  // Unknown or unhandled errors - but if we have a message, show it if it looks like a sentence
  if (err.message && err.message !== "Ein unbekannter Fehler ist aufgetreten.") {
    // If the error message is relatively short, show it
    if (err.message.length < 100) {
      return {
        title: "Fehler aufgetreten",
        message: err.message,
        action: "Bitte versuchen Sie es erneut.",
      };
    }
  }

  return {
    title: "Ein unerwarteter Fehler ist aufgetreten",
    message: "Die Anwendung hat einen Fehler, den sie nicht genau bestimmen kann.",
    action: "Bitte versuchen Sie es erneut oder wenden Sie sich an den Support.",
  };
}

export function humanErrorToToast(error: unknown): {
  kind: "error";
  title: string;
  message: string;
} {
  const humanErr = humanError(error);

  return {
    kind: "error",
    title: humanErr.title,
    message: humanErr.action ? `${humanErr.message} ${humanErr.action}` : humanErr.message,
  };
}

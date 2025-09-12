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

  if (err instanceof AuthenticationError) {
    return {
      title: "Authentifizierung fehlgeschlagen",
      message: "API-Key fehlt oder ist ungültig.",
      action: "Prüfen Sie Ihren API-Key in den Einstellungen.",
    };
  }

  if (err instanceof PermissionError) {
    return {
      title: "Zugriff verweigert",
      message: "Das gewählte Modell ist nicht verfügbar oder blockiert.",
      action: "Wählen Sie ein anderes Modell oder prüfen Sie Ihre Berechtigung.",
    };
  }

  if (err instanceof RateLimitError) {
    return {
      title: "Rate-Limit erreicht",
      message: "Zu viele Anfragen in kurzer Zeit.",
      action: "Warten Sie einen Moment und versuchen Sie es dann erneut.",
    };
  }

  if (err instanceof ApiServerError) {
    return {
      title: "Serverfehler beim Anbieter",
      message: "Der Server hatte ein Problem. Dies ist meist temporär.",
      action: "Versuchen Sie es in einigen Minuten erneut.",
    };
  }

  if (err instanceof NetworkError) {
    return {
      title: "Netzwerkfehler",
      message: "Es konnte keine Verbindung zum Server hergestellt werden.",
      action: "Prüfen Sie Ihre Internetverbindung.",
    };
  }

  if (err instanceof AbortError) {
    return {
      title: "Anfrage abgebrochen",
      message: "Die Aktion wurde von Ihnen gestoppt.",
    };
  }
  
  if (err.message.includes('NO_API_KEY')) {
    return {
      title: "API-Key erforderlich",
      message: "Kein API-Key konfiguriert.",
      action: "Gehen Sie zu den Einstellungen und fügen Sie Ihren API-Key hinzu."
    };
  }

  // Fallback für ApiClientError und UnknownError
  return {
    title: "Ein Fehler ist aufgetreten",
    message: err.message,
    action: "Bitte versuchen Sie es erneut.",
  };
}

export function humanErrorToToast(error: unknown): {
  kind: "error";
  title: string;
  message?: string;
} {
  const humanErr = humanError(error);

  return {
    kind: "error",
    title: humanErr.title,
    message: humanErr.action ? `${humanErr.message} ${humanErr.action}` : humanErr.message,
  };
}

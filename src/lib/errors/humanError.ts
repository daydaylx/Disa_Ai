/**
 * Human-readable error messages for HTTP responses and network errors.
 * Maps status codes and error types to user-friendly messages with actionable guidance.
 */

export interface HumanError {
  title: string;
  message: string;
  action?: string;
  retryAfter?: number;
}

/**
 * Convert HTTP errors and network failures to structured user-friendly messages.
 */
export function humanError(error: unknown): HumanError {
  // Handle fetch/network errors first
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: "Verbindungsfehler",
      message: "Keine Internetverbindung oder Server nicht erreichbar.",
      action: "Prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
    };
  }

  // Handle AbortError (user cancelled)
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      title: "Abgebrochen",
      message: "Die Anfrage wurde abgebrochen."
    };
  }

  // Handle HTTP status errors
  if (error instanceof Error) {
    const message = error.message;
    
    // Check for status-specific messages from mapHttpError
    if (message.includes('401') || message.toLowerCase().includes('api-key')) {
      return {
        title: "Authentifizierung fehlgeschlagen",
        message: "API-Key fehlt oder ist ungültig.",
        action: "Prüfen Sie Ihren API-Key in den Einstellungen."
      };
    }
    
    if (message.includes('403')) {
      return {
        title: "Zugriff verweigert",
        message: "Das gewählte Modell ist nicht verfügbar oder blockiert.",
        action: "Wählen Sie ein anderes Modell oder prüfen Sie Ihre Berechtigung."
      };
    }
    
    if (message.includes('429')) {
      return {
        title: "Rate-Limit erreicht",
        message: "Zu viele Anfragen. Versuchen Sie es später erneut.",
        action: "Warten Sie einen Moment und versuchen Sie es dann erneut."
      };
    }
    
    if (message.includes('5xx') || /5\d\d/.test(message)) {
      return {
        title: "Serverfehler",
        message: "Der Server ist momentan nicht verfügbar.",
        action: "Versuchen Sie es später erneut."
      };
    }

    // Check for specific error patterns
    if (message.includes('NO_API_KEY')) {
      return {
        title: "API-Key erforderlich",
        message: "Kein API-Key konfiguriert.",
        action: "Gehen Sie zu den Einstellungen und fügen Sie Ihren API-Key hinzu."
      };
    }
  }

  // Generic fallback
  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    title: "Unbekannter Fehler",
    message: errorMessage || "Ein unbekannter Fehler ist aufgetreten.",
    action: "Versuchen Sie es erneut oder kontaktieren Sie den Support."
  };
}

/**
 * Convert HumanError to toast-compatible format
 */
export function humanErrorToToast(error: unknown): { 
  kind: 'error'; 
  title: string; 
  message?: string; 
} {
  const humanErr = humanError(error);
  
  return {
    kind: 'error',
    title: humanErr.title,
    message: humanErr.action ? `${humanErr.message} ${humanErr.action}` : humanErr.message
  };
}
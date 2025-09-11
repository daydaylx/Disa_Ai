/**
 * Consistent error mapping for network requests
 * Provides user-friendly error messages for common HTTP errors
 */

export interface NetworkError extends Error {
  code: string;
  status?: number;
  retryable: boolean;
  userMessage: string;
}

/**
 * Create a NetworkError with consistent properties
 */
function createNetworkError(
  message: string,
  code: string,
  status?: number,
  retryable = false,
): NetworkError {
  const error = new Error(message) as NetworkError;
  error.name = "NetworkError";
  error.code = code;
  error.status = status;
  error.retryable = retryable;
  error.userMessage = message;
  return error;
}

/**
 * Map HTTP status codes to user-friendly error messages
 */
export function mapHttpError(status: number, statusText = ""): NetworkError {
  switch (status) {
    case 400:
      return createNetworkError(
        "Ungültige Anfrage. Bitte überprüfe deine Eingabe.",
        "BAD_REQUEST",
        status,
        false,
      );
      
    case 401:
      return createNetworkError(
        "API-Key fehlt oder ist ungültig. Bitte überprüfe deine Einstellungen.",
        "UNAUTHORIZED",
        status,
        false,
      );
      
    case 403:
      return createNetworkError(
        "Zugriff verweigert. Das Modell ist möglicherweise blockiert oder nicht verfügbar.",
        "FORBIDDEN",
        status,
        false,
      );
      
    case 404:
      return createNetworkError(
        "Modell oder Endpunkt nicht gefunden. Bitte überprüfe deine Modellauswahl.",
        "NOT_FOUND",
        status,
        false,
      );
      
    case 413:
      return createNetworkError(
        "Nachricht ist zu lang. Bitte kürze deine Anfrage.",
        "PAYLOAD_TOO_LARGE",
        status,
        false,
      );
      
    case 422:
      return createNetworkError(
        "Ungültige Parameter oder Modellkonfiguration.",
        "UNPROCESSABLE_ENTITY",
        status,
        false,
      );
      
    case 429:
      return createNetworkError(
        "Rate-Limit erreicht. Bitte warte einen Moment und versuche es erneut.",
        "RATE_LIMITED",
        status,
        true,
      );
      
    case 500:
      return createNetworkError(
        "Serverfehler beim Anbieter. Bitte versuche es später erneut.",
        "INTERNAL_SERVER_ERROR",
        status,
        true,
      );
      
    case 502:
      return createNetworkError(
        "Gateway-Fehler. Der Service ist temporär nicht verfügbar.",
        "BAD_GATEWAY",
        status,
        true,
      );
      
    case 503:
      return createNetworkError(
        "Service nicht verfügbar. Bitte versuche es später erneut.",
        "SERVICE_UNAVAILABLE",
        status,
        true,
      );
      
    case 504:
      return createNetworkError(
        "Timeout beim Server. Die Anfrage dauerte zu lange.",
        "GATEWAY_TIMEOUT",
        status,
        true,
      );
      
    default:
      if (status >= 500 && status < 600) {
        return createNetworkError(
          "Serverfehler beim Anbieter. Bitte versuche es später erneut.",
          "SERVER_ERROR",
          status,
          true,
        );
      }
      
      if (status >= 400 && status < 500) {
        return createNetworkError(
          `Client-Fehler (${status}). ${statusText || "Unbekannter Fehler"}`,
          "CLIENT_ERROR",
          status,
          false,
        );
      }
      
      return createNetworkError(
        `Unbekannter HTTP-Fehler (${status}). ${statusText || ""}`,
        "UNKNOWN_HTTP_ERROR",
        status,
        false,
      );
  }
}

/**
 * Map network-level errors to user-friendly messages
 */
export function mapNetworkError(error: Error): NetworkError {
  // Already mapped
  if ("code" in error && "userMessage" in error) {
    return error as NetworkError;
  }
  
  // Timeout errors
  if (error.message.includes("timeout") || error.message.includes("Timeout")) {
    return createNetworkError(
      "Anfrage-Timeout. Die Verbindung dauerte zu lange.",
      "TIMEOUT",
      undefined,
      true,
    );
  }
  
  // Abort errors
  if (error.name === "AbortError" || error.message.includes("aborted")) {
    return createNetworkError(
      "Anfrage wurde abgebrochen.",
      "ABORTED",
      undefined,
      false,
    );
  }
  
  // Network errors
  if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
    return createNetworkError(
      "Netzwerkfehler. Bitte überprüfe deine Internetverbindung.",
      "NETWORK_ERROR",
      undefined,
      true,
    );
  }
  
  // CORS errors
  if (error.message.includes("CORS")) {
    return createNetworkError(
      "CORS-Fehler. Es gibt ein Problem mit der Verbindung zum Server.",
      "CORS_ERROR",
      undefined,
      false,
    );
  }
  
  // SSL/TLS errors
  if (error.message.includes("SSL") || error.message.includes("certificate")) {
    return createNetworkError(
      "SSL-Verbindungsfehler. Bitte überprüfe deine Systemzeit und Netzwerkeinstellungen.",
      "SSL_ERROR",
      undefined,
      false,
    );
  }
  
  // Generic fallback
  return createNetworkError(
    `Netzwerkfehler: ${error.message}`,
    "UNKNOWN_ERROR",
    undefined,
    false,
  );
}

/**
 * Handle response errors consistently
 */
export async function handleResponseError(response: Response): Promise<never> {
  let additionalInfo = "";
  
  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await response.json();
      if (errorData.error?.message) {
        additionalInfo = ` - ${errorData.error.message}`;
      }
    } else {
      const text = await response.text();
      if (text && text.length < 200) {
        additionalInfo = ` - ${text}`;
      }
    }
  } catch {
    // Ignore errors when trying to read response body
  }
  
  const error = mapHttpError(response.status, response.statusText);
  if (additionalInfo) {
    error.userMessage += additionalInfo;
  }
  
  throw error;
}
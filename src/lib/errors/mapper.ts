import {
  AbortError,
  ApiClientError,
  ApiServerError,
  AuthenticationError,
  HttpError,
  NetworkError,
  NotFoundError,
  PermissionError,
  RateLimitError,
  UnknownError,
} from "./types";

/**
 * Converts an HTTP Response object to an appropriate HttpError subclass
 * based on the status code
 *
 * @param res - The HTTP Response object to convert
 * @returns An HttpError instance with appropriate subtype
 */
function fromResponse(res: Response): HttpError {
  const { status, statusText, headers } = res;
  const options = { headers };

  switch (status) {
    case 401:
      return new AuthenticationError(
        "Authentifizierung fehlgeschlagen",
        status,
        statusText,
        options,
      );
    case 403:
      return new PermissionError("Zugriff verweigert", status, statusText, options);
    case 404:
      return new NotFoundError("Ressource nicht gefunden", status, statusText, options);
    case 429:
      return new RateLimitError("Rate-Limit erreicht", status, statusText, options);
    default: {
      const message = `HTTP-Fehler ${status} (${statusText})`;
      if (status >= 400 && status < 500) {
        return new ApiClientError(message, status, statusText, options);
      }
      if (status >= 500 && status < 600) {
        return new ApiServerError(message, status, statusText, options);
      }
      return new HttpError(message, status, statusText, options);
    }
  }
}

/**
 * Maps unknown errors to structured error types for consistent error handling
 *
 * This function converts various error types (DOM exceptions, fetch errors, HTTP responses)
 * into our standardized error hierarchy, enabling consistent error handling across the app.
 *
 * @param error - The unknown error to map
 * @returns A structured Error instance from our error hierarchy
 *
 * @example
 * ```typescript
 * try {
 *   const response = await fetch('/api/data');
 *   if (!response.ok) throw response;
 * } catch (error) {
 *   const mappedError = mapError(error);
 *   if (mappedError instanceof AuthenticationError) {
 *     // Handle auth error
 *   }
 * }
 * ```
 */
export function mapError(error: unknown): Error {
  // Return already-mapped errors as-is
  if (
    error instanceof HttpError ||
    error instanceof NetworkError ||
    error instanceof AbortError ||
    error instanceof UnknownError
  ) {
    return error;
  }

  // Handle DOM exceptions (fetch aborts, network errors)
  if (error instanceof DOMException) {
    if (error.name === "AbortError") {
      return new AbortError(error.message, { cause: error });
    }
    return new NetworkError(`Netzwerkfehler: ${error.message}`, { cause: error });
  }

  // Handle fetch network failures
  if (error instanceof TypeError && error.message.toLowerCase().includes("failed to fetch")) {
    return new NetworkError("Netzwerkfehler: Verbindung fehlgeschlagen.", { cause: error });
  }

  // Handle HTTP Response objects (non-ok responses)
  if (error instanceof Response) {
    return fromResponse(error);
  }

  // Fallback for all other error types
  const message =
    error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten.";
  return new UnknownError(message, { cause: error });
}

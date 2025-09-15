/**
 * Basisklasse für alle API- und Netzwerk-bezogenen Fehler.
 * Ermöglicht es, Fehler aus dem API-Layer gezielt abzufangen.
 */
export class ApiError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Fehler, der auftritt, wenn die Netzwerkanfrage selbst fehlschlägt
 * (z.B. DNS-Problem, Offline, CORS-Fehler, Timeout).
 */
export class NetworkError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, NetworkError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}

/**
 * Fehler, der auftritt, wenn eine Anfrage aufgrund eines Timeouts fehlschlägt.
 */
export class TimeoutError extends NetworkError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, TimeoutError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }
}

/**
 * Fehler, der auftritt, wenn eine Anfrage durch ein AbortSignal abgebrochen
 * wurde.
 * Dies ist typischerweise eine vom Nutzer initiierte Aktion.
 */
export class AbortError extends ApiError {
  constructor(message = "Die Anfrage wurde abgebrochen.", options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, AbortError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AbortError);
    }
  }
}

/**
 * Basisklasse für alle Fehler, die aus einer HTTP-Antwort mit einem
 * Fehlerstatus-Code (>= 400) resultieren.
 */
export class HttpError extends ApiError {
  public readonly status: number;
  public readonly statusText: string;

  constructor(message: string, status: number, statusText: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = this.constructor.name;
    this.status = status;
    this.statusText = statusText;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

/**
 * Fehler für HTTP 429 "Too Many Requests".
 * Tritt auf, wenn ein Rate-Limit oder ein Quota überschritten wurde.
 */
export class RateLimitError extends HttpError {
  constructor(message: string, status: number, statusText: string, options?: ErrorOptions) {
    super(message, status, statusText, options);
    Object.setPrototypeOf(this, RateLimitError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RateLimitError);
    }
  }
}

/**
 * Fehler für HTTP 401 "Unauthorized".
 * Tritt auf, wenn ein API-Key fehlt oder ungültig ist.
 */
export class AuthenticationError extends HttpError {
  constructor(message: string, status: number, statusText: string, options?: ErrorOptions) {
    super(message, status, statusText, options);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
  }
}

/**
 * Fehler für HTTP 403 "Forbidden".
 * Tritt auf, wenn der Zugriff auf eine Ressource verweigert wird.
 */
export class PermissionError extends HttpError {
  constructor(message: string, status: number, statusText: string, options?: ErrorOptions) {
    super(message, status, statusText, options);
    Object.setPrototypeOf(this, PermissionError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionError);
    }
  }
}

/**
 * Fehler für HTTP 404 "Not Found".
 */
export class NotFoundError extends HttpError {
  constructor(message: string, status: number, statusText: string, options?: ErrorOptions) {
    super(message, status, statusText, options);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

/**
 * Catch-all für andere 4xx-Client-Fehler.
 */
export class ApiClientError extends HttpError {
  constructor(message: string, status: number, statusText: string, options?: ErrorOptions) {
    super(message, status, statusText, options);
    Object.setPrototypeOf(this, ApiClientError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }
}

/**
 * Catch-all für 5xx-Server-Fehler.
 */
export class ApiServerError extends HttpError {
  constructor(message: string, status: number, statusText: string, options?: ErrorOptions) {
    super(message, status, statusText, options);
    Object.setPrototypeOf(this, ApiServerError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiServerError);
    }
  }
}

/**
 * Fallback-Fehler für alle nicht erkannten oder nicht klassifizierten Fehler.
 */
export class UnknownError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, UnknownError.prototype);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnknownError);
    }
  }
}

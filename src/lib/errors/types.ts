/**
 * Basisklasse für alle API- und Netzwerk-bezogenen Fehler.
 * Ermöglicht es, Fehler aus dem API-Layer gezielt abzufangen.
 */
export class ApiError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
    this.name = new.target.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}

/**
 * Fehler, der auftritt, wenn die Netzwerkanfrage selbst fehlschlägt
 * (z.B. DNS-Problem, Offline, CORS-Fehler, Timeout).
 */
export class NetworkError extends ApiError {}

/**
 * Fehler, der auftritt, wenn eine Anfrage aufgrund eines Timeouts fehlschlägt.
 */
export class TimeoutError extends NetworkError {}

/**
 * Fehler, der auftritt, wenn eine Anfrage durch ein AbortSignal abgebrochen wurde.
 * Dies ist typischerweise eine vom Nutzer initiierte Aktion.
 */
export class AbortError extends ApiError {
  constructor(message = "Die Anfrage wurde abgebrochen.", options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * Basisklasse für alle Fehler, die aus einer HTTP-Antwort mit einem
 * Fehlerstatus-Code (>= 400) resultieren.
 */
export class HttpError extends ApiError {
  public readonly status: number;
  public readonly statusText: string;
  public readonly headers?: Headers;

  constructor(
    message: string,
    status: number,
    statusText: string,
    options?: (ErrorOptions & { headers?: Headers }) | undefined,
  ) {
    const { headers, ...rest } = options ?? {};
    super(message, rest);
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
  }
}

/**
 * Fehler für HTTP 429 "Too Many Requests".
 * Tritt auf, wenn ein Rate-Limit oder ein Quota überschritten wurde.
 */
export class RateLimitError extends HttpError {
  public readonly retryAfterSeconds?: number;
  public readonly backoffDelay?: number;

  constructor(
    message: string,
    status: number,
    statusText: string,
    options?:
      | (ErrorOptions & { headers?: Headers; backoffDelay?: number; retryAfter?: number })
      | undefined,
  ) {
    const rateLimitOptions = options ?? {};
    const { retryAfter, backoffDelay, ...httpOptions } = rateLimitOptions;
    super(message, status, statusText, httpOptions);
    this.retryAfterSeconds = retryAfter ?? parseRetryAfterSeconds(this.headers);
    this.backoffDelay = backoffDelay;
  }
}

/**
 * Fehler für HTTP 401 "Unauthorized".
 * Tritt auf, wenn ein API-Key fehlt oder ungültig ist.
 */
export class AuthenticationError extends HttpError {}

/**
 * Fehler für HTTP 403 "Forbidden".
 * Tritt auf, wenn der Zugriff auf eine Ressource verweigert wird.
 */
export class PermissionError extends HttpError {}

/**
 * Fehler für HTTP 404 "Not Found".
 */
export class NotFoundError extends HttpError {}

/**
 * Catch-all für andere 4xx-Client-Fehler.
 */
export class ApiClientError extends HttpError {}

/**
 * Catch-all für 5xx-Server-Fehler.
 */
export class ApiServerError extends HttpError {}

function parseRetryAfterSeconds(headers?: Headers): number | undefined {
  if (!headers) return undefined;
  const raw = headers.get("retry-after");
  if (!raw) return undefined;

  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return numeric;
  }

  const dateValue = Date.parse(raw);
  if (Number.isNaN(dateValue)) return undefined;

  const diffMs = dateValue - Date.now();
  if (diffMs <= 0) return undefined;

  return Math.ceil(diffMs / 1000);
}

/**
 * Fallback-Fehler für alle nicht erkannten oder nicht klassifizierten Fehler.
 */
export class UnknownError extends ApiError {}

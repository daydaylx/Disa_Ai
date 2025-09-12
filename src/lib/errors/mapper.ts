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

function fromResponse(res: Response): HttpError {
  const { status, statusText } = res;
  const message = `HTTP-Fehler ${status} (${statusText})`;

  switch (status) {
    case 401: return new AuthenticationError(message, status, statusText);
    case 403: return new PermissionError(message, status, statusText);
    case 404: return new NotFoundError(message, status, statusText);
    case 429: return new RateLimitError(message, status, statusText);
    default:
      if (status >= 400 && status < 500) {
        return new ApiClientError(message, status, statusText);
      }
      if (status >= 500 && status < 600) {
        return new ApiServerError(message, status, statusText);
      }
      return new HttpError(message, status, statusText);
  }
}

export function mapError(error: unknown): Error {
  if (
    error instanceof HttpError ||
    error instanceof NetworkError ||
    error instanceof AbortError ||
    error instanceof UnknownError
  ) {
    return error;
  }

  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      return new AbortError(error.message, { cause: error });
    }
    return new NetworkError(`Netzwerkfehler: ${error.message}`, { cause: error });
  }

  if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
    return new NetworkError('Netzwerkfehler: Verbindung fehlgeschlagen.', { cause: error });
  }

  if (error instanceof Response) {
    return fromResponse(error);
  }

  const message = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
  return new UnknownError(message, { cause: error });
}
import { describe, expect,it } from "vitest";

import { mapError } from "../mapper";
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
} from "../types";

describe("mapError", () => {
  it("sollte eine DOMException mit dem Namen 'AbortError' als AbortError mappen", () => {
    const domException = new DOMException("The user aborted a request.", "AbortError");
    const mappedError = mapError(domException);
    expect(mappedError).toBeInstanceOf(AbortError);
    expect(mappedError.name).toBe("AbortError");
    expect(mappedError.message).toBe("The user aborted a request.");
    expect(mappedError.cause).toBe(domException);
  });

  it("sollte einen TypeError mit 'failed to fetch' als NetworkError mappen", () => {
    const typeError = new TypeError("failed to fetch");
    const mappedError = mapError(typeError);
    expect(mappedError).toBeInstanceOf(NetworkError);
    expect(mappedError.name).toBe("NetworkError");
    expect(mappedError.message).toBe("Netzwerkfehler: Verbindung fehlgeschlagen.");
    expect(mappedError.cause).toBe(typeError);
  });

  it("sollte eine Response mit Status 401 als AuthenticationError mappen", () => {
    const response = new Response(null, { status: 401, statusText: "Unauthorized" });
    const mappedError = mapError(response);
    expect(mappedError).toBeInstanceOf(AuthenticationError);
    expect(mappedError.name).toBe("AuthenticationError");
    expect((mappedError as HttpError).status).toBe(401);
  });

  it("sollte eine Response mit Status 403 als PermissionError mappen", () => {
    const response = new Response(null, { status: 403, statusText: "Forbidden" });
    const mappedError = mapError(response);
    expect(mappedError).toBeInstanceOf(PermissionError);
    expect(mappedError.name).toBe("PermissionError");
    expect((mappedError as HttpError).status).toBe(403);
  });

  it("sollte eine Response mit Status 404 als NotFoundError mappen", () => {
    const response = new Response(null, { status: 404, statusText: "Not Found" });
    const mappedError = mapError(response);
    expect(mappedError).toBeInstanceOf(NotFoundError);
    expect(mappedError.name).toBe("NotFoundError");
    expect((mappedError as HttpError).status).toBe(404);
  });

  it("sollte eine Response mit Status 429 als RateLimitError mappen", () => {
    const response = new Response(null, { status: 429, statusText: "Too Many Requests" });
    const mappedError = mapError(response);
    expect(mappedError).toBeInstanceOf(RateLimitError);
    expect(mappedError.name).toBe("RateLimitError");
    expect((mappedError as HttpError).status).toBe(429);
  });

  it("sollte eine Response mit einem 4xx-Status als ApiClientError mappen", () => {
    const response = new Response(null, { status: 418, statusText: "I'm a teapot" });
    const mappedError = mapError(response);
    expect(mappedError).toBeInstanceOf(ApiClientError);
    expect(mappedError.name).toBe("ApiClientError");
    expect((mappedError as HttpError).status).toBe(418);
  });

  it("sollte eine Response mit einem 5xx-Status als ApiServerError mappen", () => {
    const response = new Response(null, { status: 503, statusText: "Service Unavailable" });
    const mappedError = mapError(response);
    expect(mappedError).toBeInstanceOf(ApiServerError);
    expect(mappedError.name).toBe("ApiServerError");
    expect((mappedError as HttpError).status).toBe(503);
  });

  it("sollte einen generischen Error als UnknownError mappen", () => {
    const genericError = new Error("Something went wrong");
    const mappedError = mapError(genericError);
    expect(mappedError).toBeInstanceOf(UnknownError);
    expect(mappedError.name).toBe("UnknownError");
    expect(mappedError.message).toBe("Something went wrong");
    expect(mappedError.cause).toBe(genericError);
  });

  it("sollte einen String als UnknownError mappen", () => {
    const stringError = "Just a string";
    const mappedError = mapError(stringError);
    expect(mappedError).toBeInstanceOf(UnknownError);
    expect(mappedError.name).toBe("UnknownError");
    expect(mappedError.message).toBe("Ein unbekannter Fehler ist aufgetreten.");
    expect(mappedError.cause).toBe(stringError);
  });

  it("sollte null und undefined als UnknownError mappen", () => {
    const nullError = mapError(null);
    expect(nullError).toBeInstanceOf(UnknownError);
    expect(nullError.name).toBe("UnknownError");
    expect(nullError.cause).toBe(null);

    const undefinedError = mapError(undefined);
    expect(undefinedError).toBeInstanceOf(UnknownError);
    expect(undefinedError.name).toBe("UnknownError");
    expect(undefinedError.cause).toBe(undefined);
  });
});
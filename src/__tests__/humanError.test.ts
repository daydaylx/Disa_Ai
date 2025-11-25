import { describe, expect, it } from "vitest";

import { AuthenticationError, NetworkError, RateLimitError } from "../lib/errors";
import { humanError, humanErrorToToast } from "../lib/errors/humanError";

describe("humanError", () => {
  it("should handle AuthenticationError", () => {
    const error = new AuthenticationError("Auth failed", 401, "Unauthorized");
    const result = humanError(error);

    expect(result.title).toBe("Authentifizierung fehlgeschlagen");
    expect(result.message).toBe("API-Key fehlt oder ist ungültig.");
  });

  it("should handle RateLimitError", () => {
    const error = new RateLimitError("Rate limit", 429, "Too Many Requests");
    const result = humanError(error);

    expect(result.title).toBe("Rate-Limit erreicht");
    expect(result.message).toBe("Zu viele Anfragen in kurzer Zeit.");
  });

  it("should handle NetworkError", () => {
    const error = new NetworkError("fetch failed");
    const result = humanError(error);

    expect(result.title).toBe("Netzwerkfehler");
    expect(result.message).toBe("Es konnte keine Verbindung zum Server hergestellt werden.");
  });

  it("should handle NO_API_KEY errors", () => {
    const error = new Error("NO_API_KEY");
    const result = humanError(error);

    expect(result.title).toBe("Verbindungsproblem");
    expect(result.message).toBe(
      "Die App konnte keine Verbindung zum öffentlichen Proxy herstellen.",
    );
  });

  it("should convert to toast format", () => {
    const error = new AuthenticationError("Auth failed", 401, "Unauthorized");
    const toast = humanErrorToToast(error);

    expect(toast.kind).toBe("error");
    expect(toast.title).toBe("Authentifizierung fehlgeschlagen");
    expect(toast.message).toContain("API-Key fehlt oder ist ungültig.");
  });
});

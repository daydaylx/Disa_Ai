/**
 * Unit Tests for Vision API Client
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { VisionAttachment } from "@/types/chat";

import {
  sendVisionRequest,
  validateVisionRequest,
  VisionApiError,
  type VisionResponse,
} from "../vision";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("validateVisionRequest", () => {
  const mockAttachment: VisionAttachment = {
    id: "test-id",
    dataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
    mimeType: "image/jpeg",
    filename: "test.jpg",
    timestamp: Date.now(),
    size: 1024,
  };

  it("should validate correct request", () => {
    const result = validateVisionRequest("Was ist auf diesem Bild?", mockAttachment);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should reject empty prompt", () => {
    const result = validateVisionRequest("", mockAttachment);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Bitte gib einen Text ein");
  });

  it("should reject whitespace-only prompt", () => {
    const result = validateVisionRequest("   ", mockAttachment);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Bitte gib einen Text ein");
  });

  it("should reject missing attachment", () => {
    const result = validateVisionRequest("Was ist auf diesem Bild?", undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Bitte hänge ein Bild an");
  });

  it("should reject attachment with empty dataUrl", () => {
    const invalidAttachment = {
      ...mockAttachment,
      dataUrl: "",
    };
    const result = validateVisionRequest("Was ist auf diesem Bild?", invalidAttachment);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Bitte hänge ein Bild an");
  });
});

describe("sendVisionRequest", () => {
  const mockAttachment: VisionAttachment = {
    id: "test-id",
    dataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
    mimeType: "image/jpeg",
    filename: "test.jpg",
    timestamp: Date.now(),
    size: 1024,
  };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should send successful request", async () => {
    const mockResponse: VisionResponse = {
      text: "Dies ist ein Bild mit...",
      model: "glm-4.6v",
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await sendVisionRequest("Was ist auf diesem Bild?", mockAttachment);

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/vision",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: expect.stringContaining("Was ist auf diesem Bild?"),
      }),
    );
  });

  it("should throw VisionApiError for empty prompt", async () => {
    await expect(sendVisionRequest("", mockAttachment)).rejects.toThrow(VisionApiError);
  });

  it("should throw VisionApiError for missing attachment", async () => {
    await expect(sendVisionRequest("Was ist auf diesem Bild?", null as any)).rejects.toThrow(
      VisionApiError,
    );
  });

  it("should handle 400 error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          error: {
            code: "BAD_REQUEST",
            message: "Ungültiger Request",
          },
        }),
    });

    await expect(sendVisionRequest("Was ist auf diesem Bild?", mockAttachment)).rejects.toThrow(
      VisionApiError,
    );
  });

  it("should handle 413 payload too large", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 413,
      json: () =>
        Promise.resolve({
          error: {
            code: "PAYLOAD_TOO_LARGE",
            message: "Bild zu groß",
          },
        }),
    });

    await expect(sendVisionRequest("Was ist auf diesem Bild?", mockAttachment)).rejects.toThrow(
      VisionApiError,
    );
  });

  it("should handle 500 internal server error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({
          error: {
            code: "INTERNAL_ERROR",
            message: "Interner Serverfehler",
          },
        }),
    });

    await expect(sendVisionRequest("Was ist auf diesem Bild?", mockAttachment)).rejects.toThrow(
      VisionApiError,
    );
  });

  it("should handle invalid response structure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          // Missing 'text' field
          model: "glm-4.6v",
        }),
    });

    await expect(sendVisionRequest("Was ist auf diesem Bild?", mockAttachment)).rejects.toThrow(
      VisionApiError,
    );
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(sendVisionRequest("Was ist auf diesem Bild?", mockAttachment)).rejects.toThrow(
      VisionApiError,
    );
  });

  it("should handle abort signal", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      sendVisionRequest("Was ist auf diesem Bild?", mockAttachment, controller.signal),
    ).rejects.toThrow(VisionApiError);
  });

  it("should trim prompt", async () => {
    const mockResponse: VisionResponse = {
      text: "Antwort",
      model: "glm-4.6v",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    await sendVisionRequest("  Was ist auf diesem Bild?  ", mockAttachment);

    const requestBody = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(requestBody.prompt).toBe("Was ist auf diesem Bild?");
  });

  it("should include filename in request", async () => {
    const mockResponse: VisionResponse = {
      text: "Antwort",
      model: "glm-4.6v",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    await sendVisionRequest("Was ist auf diesem Bild?", mockAttachment);

    const requestBody = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(requestBody.filename).toBe("test.jpg");
  });

  it("should handle error response without error object", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.resolve({}), // No error object
    });

    await expect(sendVisionRequest("Was ist auf diesem Bild?", mockAttachment)).rejects.toThrow(
      VisionApiError,
    );
  });

  it("should timeout after 45 seconds", async () => {
    // Mock setTimeout to trigger immediately
    vi.useFakeTimers();

    try {
      mockFetch.mockImplementationOnce((_url, options) => {
        const signal = (options as RequestInit | undefined)?.signal as AbortSignal | undefined;

        return new Promise((resolve, reject) => {
          if (signal?.aborted) {
            const error = new Error("Aborted");
            error.name = "AbortError";
            reject(error);
            return;
          }

          const handleAbort = () => {
            signal?.removeEventListener("abort", handleAbort);
            const error = new Error("Aborted");
            error.name = "AbortError";
            reject(error);
          };

          signal?.addEventListener("abort", handleAbort);

          setTimeout(() => {
            signal?.removeEventListener("abort", handleAbort);
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ text: "Antwort", model: "glm-4.6v" }),
            } as Response);
          }, 50000);
        });
      });

      const promise = sendVisionRequest("Was ist auf diesem Bild?", mockAttachment);
      const expectation = expect(promise).rejects.toThrow(VisionApiError);

      // Fast-forward past timeout
      await vi.advanceTimersByTimeAsync(45000);

      await expectation;
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("VisionApiError", () => {
  it("should create error with message and code", () => {
    const error = new VisionApiError("Test error", 400, "TEST_CODE");
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("TEST_CODE");
    expect(error.name).toBe("VisionApiError");
  });

  it("should create error with only message", () => {
    const error = new VisionApiError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBeUndefined();
    expect(error.code).toBeUndefined();
  });
});

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChat } from "../useChat";
import { chatStream } from "../../api/openrouter";
import { RateLimitError, AuthenticationError } from "../../lib/errors/types";

// Mock api/openrouter
vi.mock("../../api/openrouter", () => ({
  chatStream: vi.fn(),
}));

describe("useChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with idle status", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.status).toBe("idle");
  });

  it("should set status to streaming when append is called", async () => {
    const { result } = renderHook(() => useChat());

    // Mock successful stream
    (chatStream as any).mockImplementation(async (_messages, onDelta, opts) => {
        if (opts.onStart) opts.onStart();
        onDelta("Hello");
        if (opts.onDone) opts.onDone();
    });

    await act(async () => {
      await result.current.append({ role: "user", content: "Hi" });
    });

    // It should be ok at the end
    expect(result.current.status).toBe("ok");
  });

  it("should set status to rate_limited on RateLimitError", async () => {
    const { result } = renderHook(() => useChat());

    (chatStream as any).mockImplementation(async () => {
        throw new RateLimitError("Rate limit", 429, "Too Many Requests");
    });

    await act(async () => {
       await result.current.append({ role: "user", content: "Hi" });
    });

    expect(result.current.status).toBe("rate_limited");
  });

  it("should set status to missing_key on AuthenticationError", async () => {
      const { result } = renderHook(() => useChat());

      (chatStream as any).mockImplementation(async () => {
          throw new AuthenticationError("Auth failed", 401, "Unauthorized");
      });

      await act(async () => {
         await result.current.append({ role: "user", content: "Hi" });
      });

      expect(result.current.status).toBe("missing_key");
    });

   it("should set status to missing_key on NO_API_KEY error message", async () => {
      const { result } = renderHook(() => useChat());

      (chatStream as any).mockImplementation(async () => {
          throw new Error("NO_API_KEY");
      });

      await act(async () => {
         await result.current.append({ role: "user", content: "Hi" });
      });

      expect(result.current.status).toBe("missing_key");
    });

  it("should set status to error on generic Error", async () => {
      const { result } = renderHook(() => useChat());

      (chatStream as any).mockImplementation(async () => {
          throw new Error("Boom");
      });

      await act(async () => {
         await result.current.append({ role: "user", content: "Hi" });
      });

      expect(result.current.status).toBe("error");
    });
});

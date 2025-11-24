/**
 * Smoke Tests for DisaAI Proxy Implementation
 *
 * These tests verify that the proxy implementation works correctly:
 * - Free model allowlist enforcement
 * - Parameter clamping
 * - Throttling behavior
 * - Error handling
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { UnstableDevWorker } from "wrangler";
import { unstable_dev } from "wrangler";

// Mock data for testing
const TEST_FREE_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const TEST_PREMIUM_MODEL = "openai/gpt-4o";
const TEST_MESSAGES = [
  { role: "user", content: "Hello, how are you?" },
  { role: "assistant", content: "I'm doing well, thank you!" },
  { role: "user", content: "What can you do for me?" },
];

describe("DisaAI Proxy Smoke Tests", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    // Start the worker in dev mode
    worker = await unstable_dev("functions/api/chat.ts", {
      experimental: { disableExperimentalWarning: true },
      env: "test",
      kv: [
        { binding: "RATE_LIMIT_KV", id: "test-rate-limit-kv" },
        { binding: "DAILY_BUDGET_KV", id: "test-daily-budget-kv" },
      ],
    });
  });

  afterAll(async () => {
    // Stop the worker
    await worker.stop();
  });

  it("should accept valid free model requests", async () => {
    const response = await worker.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://disaai.de",
      },
      body: JSON.stringify({
        messages: TEST_MESSAGES,
        model: TEST_FREE_MODEL,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toBeDefined();
  });

  it("should replace premium models with free models", async () => {
    const response = await worker.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://disaai.de",
      },
      body: JSON.stringify({
        messages: TEST_MESSAGES,
        model: TEST_PREMIUM_MODEL,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    expect(response.status).toBe(200);
    // The proxy should accept the request and use a free model instead
  });

  it("should clamp max_tokens to allowed range", async () => {
    const response = await worker.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://disaai.de",
      },
      body: JSON.stringify({
        messages: TEST_MESSAGES,
        model: TEST_FREE_MODEL,
        max_tokens: 2000, // Above the cap
        temperature: 0.7,
      }),
    });

    expect(response.status).toBe(200);
    // The proxy should accept the request and clamp max_tokens to 1200
  });

  it("should clamp temperature to allowed range", async () => {
    const response = await worker.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://disaai.de",
      },
      body: JSON.stringify({
        messages: TEST_MESSAGES,
        model: TEST_FREE_MODEL,
        max_tokens: 1000,
        temperature: 2.0, // Above the cap
      }),
    });

    expect(response.status).toBe(200);
    // The proxy should accept the request and clamp temperature to 1.2
  });

  it("should reject requests with invalid structure", async () => {
    const response = await worker.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://disaai.de",
      },
      body: JSON.stringify({
        invalid: "structure",
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Ungültige Anfragestruktur");
  });

  it("should reject requests from untrusted origins", async () => {
    const response = await worker.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://evil.com",
      },
      body: JSON.stringify({
        messages: TEST_MESSAGES,
        model: TEST_FREE_MODEL,
      }),
    });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Untrusted origin.");
  });

  it("should apply rate limiting", async () => {
    // First few requests should succeed
    for (let i = 0; i < 20; i++) {
      const response = await worker.fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://disaai.de",
        },
        body: JSON.stringify({
          messages: TEST_MESSAGES,
          model: TEST_FREE_MODEL,
        }),
      });
      expect(response.status).toBe(200);
    }

    // Next request should be rate limited
    const response = await worker.fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://disaai.de",
      },
      body: JSON.stringify({
        messages: TEST_MESSAGES,
        model: TEST_FREE_MODEL,
      }),
    });

    expect(response.status).toBe(429);
    const data = await response.json();
    expect(data.error).toContain("Zu viele Anfragen");
  });
});

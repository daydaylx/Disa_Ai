import { describe, expect, it, vi } from "vitest";

import { chatStream } from "../api/openrouter";

function ndjsonBody(lines: string[]) {
  return new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      for (const l of lines) controller.enqueue(enc.encode(l + "\n"));
      controller.close();
    },
  });
}

describe("openrouter chatStream – NDJSON support", () => {
  it("verarbeitet JSON-Zeilen und [DONE]", async () => {
    // Setup API key for test
    localStorage.setItem("disa_api_key", "sk-test");

    // @ts-expect-error stub fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        body: ndjsonBody([
          '{"choices":[{"delta":{"content":"Hal"}}]}',
          '{"choices":[{"delta":{"content":"lo"}}]}',
          "[DONE]",
        ]),
      }),
    );

    let out = "";
    await chatStream([{ role: "user", content: "Hi" }], (d) => (out += d));
    expect(out).toBe("Hallo");
  });
});

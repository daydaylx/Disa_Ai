import { describe, expect, it, vi } from "vitest";

import { mockFetch } from "../../tests/setup/fetch"; // Keep this for the second test
import { chatOnce, chatStream } from "../api/openrouter";
import { RateLimitError } from "../lib/errors";

function sseBody(parts: string[]) {
  // Simuliere einen Responsekörper mit SSE Frames
  return new ReadableStream({
    start(controller) {
      for (const p of parts) controller.enqueue(new TextEncoder().encode(p));
      controller.close();
    },
  });
}

describe("openrouter chatStream", () => {
  it("parst mehrere data-Frames + [DONE]", async () => {
    // @ts-expect-error stub fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        body: sseBody([
          `data: {"choices":[{"delta":{"content":"Hal"}}]}

`,
          `data: {"choices":[{"delta":{"content":"lo"}}]}

`,
          `data: [DONE]

`,
        ]),
      }),
    );

    // key bereitstellen
    localStorage.setItem("disa_api_key", "sk-test");

    let out = "";
    await chatStream([{ role: "user", content: "Hi" }], (d) => (out += d), {
      onDone: (full) => expect(full).toBe("Hallo"),
    });
    expect(out).toBe("Hallo");
  });

  it("mapped HTTP Fehler klar", async () => {
    mockFetch({}, { ok: false, status: 429 });
    localStorage.setItem("disa_api_key", "sk-test");
    await expect(chatOnce([{ role: "user", content: "Ping" }])).rejects.toThrow(RateLimitError);
  });
});

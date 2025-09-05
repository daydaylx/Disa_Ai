import { describe, expect, it, vi } from "vitest";

import { chatOnce, chatStream } from "../api/openrouter";

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
    global.fetch = vi.fn(async () => ({
      ok: true,
      body: sseBody([
        'data: {"choices":[{"delta":{"content":"Hal"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"lo"}}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    }));

    // key bereitstellen
    localStorage.setItem("disa_api_key", "sk-test");

    let out = "";
    await chatStream([{ role: "user", content: "Hi" }], (d) => (out += d), {
      onDone: (full) => expect(full).toBe("Hallo"),
    });
    expect(out).toBe("Hallo");
  });

  it("mapped HTTP Fehler klar", async () => {
    // @ts-expect-error stub fetch
    global.fetch = vi.fn(async () => ({ ok: false, status: 429 }));
    localStorage.setItem("disa_api_key", "sk-test");
    await expect(chatOnce([{ role: "user", content: "Ping" }])).rejects.toThrow(/429|Rate-Limit/);
  });
});

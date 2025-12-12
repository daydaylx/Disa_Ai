import { describe, expect, it, vi } from "vitest";

import { getRawModels } from "../api/openrouter";

describe("getRawModels cache", () => {
  it("uses cache within TTL and avoids fetch", async () => {
    const sample = [{ id: "m1" }, { id: "m2" }];
    localStorage.setItem("disa:or:models:v1", JSON.stringify(sample));
    localStorage.setItem("disa:or:models:ts", String(Date.now()));

    const fetchSpy = vi
      .spyOn(globalThis, "fetch" as any)
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) } as any);
    const list = await getRawModels(undefined, 60_000);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(2);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

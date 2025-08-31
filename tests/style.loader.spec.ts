import { afterEach, describe, expect, it, vi } from "vitest";
import { loadStyleConfig, getDefaultRole, getPolicyForRole } from "@/config/style";

afterEach(() => {
  vi.restoreAllMocks();
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {}
});

describe("style.json Loader", () => {
  it("lädt und normalisiert die Konfiguration (mit defaultRole)", async () => {
    const wire = {
      version: 2,
      defaultRole: "balanced",
      roles: {
        nocensor: { policy: "any" },
        balanced: { policy: "medium", systemPrompt: "ok" },
      },
    };

    const fetchMock = vi.spyOn(globalThis, "fetch" as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => wire,
    } as Response);

    const cfg = await loadStyleConfig(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getDefaultRole(cfg)).toBe("balanced");
    expect(getPolicyForRole(cfg, "balanced")).toBe("medium");
    expect(getPolicyForRole(cfg, "nocensor")).toBe("any");
  });

  it("fällt auf Fallback-Config zurück, wenn Fetch fehlschlägt", async () => {
    vi.spyOn(globalThis, "fetch" as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const cfg = await loadStyleConfig(0);
    // Fallback hat "nocensor" und policy "any"
    expect(getPolicyForRole(cfg, "nocensor")).toBe("any");
  });
});

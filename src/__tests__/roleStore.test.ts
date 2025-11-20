import { beforeEach, describe, expect, it, vi } from "vitest";

import { resolvePublicAssetUrl } from "../lib/publicAssets";

type FetchMock = ReturnType<typeof vi.fn>;

describe("roleStore", () => {
  let mockFetch: FetchMock;

  beforeEach(() => {
    vi.resetModules();

    mockFetch = vi.fn();
    (global as any).fetch = mockFetch;

    (global as any).localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
  });

  it("lädt Rollen ausschließlich aus persona.json", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        await Promise.resolve();
        return {
          styles: [
            {
              id: "author",
              name: "Author",
              system: "Schreibe prägnant",
              allow: ["openrouter/demo"],
              tags: ["creative"],
            },
          ],
        };
      },
    });

    const { fetchRoleTemplates, getRoleState } = await import("../config/roleStore");

    const roles = await fetchRoleTemplates(true);

    expect(mockFetch).toHaveBeenCalledWith(resolvePublicAssetUrl("persona.json"), {
      cache: "no-store",
    });
    expect(roles).toEqual([
      {
        id: "author",
        name: "Author",
        system: "Schreibe prägnant",
        allow: ["openrouter/demo"],
        tags: ["creative"],
      },
    ]);
    expect(getRoleState().state).toBe("ok");
  });

  it("meldet missing, wenn persona.json nicht geladen werden kann", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network down"));

    const { fetchRoleTemplates, getRoleState } = await import("../config/roleStore");

    const roles = await fetchRoleTemplates(true);

    expect(roles).toEqual([]);
    expect(getRoleState().state).toBe("error");
    expect(getRoleState().error).toContain(resolvePublicAssetUrl("persona.json"));
  });
});

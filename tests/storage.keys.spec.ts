import { afterEach, describe, expect, it } from "vitest";
import {
  nsKey,
  convIndexKey,
  convMetaKey,
  convMsgsKey,
  migrateStorage,
  listKeys,
  setJSON,
  getJSON
} from "@/utils/storage";

afterEach(() => {
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {}
});

describe("Storage-Keys & Migration", () => {
  it("bildet Namespaced Keys korrekt", () => {
    expect(nsKey("conv", "123", "meta")).toBe("disa:conv:123:meta");
    expect(convIndexKey()).toBe("disa:conv:index");
    expect(convMetaKey("abc")).toBe("disa:conv:abc:meta");
    expect(convMsgsKey("abc")).toBe("disa:conv:abc:msgs");
  });

  it("Migration entfernt kaputte Literal-Keys und stellt Index bereit", () => {
    // Legacy-Mist
    window.localStorage.setItem("disa:conv:${id}:meta", "{}");
    window.localStorage.setItem("disa:conv:${id}:msgs", "[]");

    migrateStorage();

    const keys = listKeys("disa:");
    expect(keys.includes("disa:conv:${id}:meta")).toBe(false);
    expect(keys.includes("disa:conv:${id}:msgs")).toBe(false);

    // Index ist immer ein Array
    const idx = getJSON<string[]>(convIndexKey());
    expect(Array.isArray(idx)).toBe(true);
  });

  it("JSON Helper lesen/schreiben stabil", () => {
    const key = convMetaKey("x1");
    const meta = { id: "x1", title: "Test", createdAt: 1, updatedAt: 1 };
    setJSON(key, meta);
    const back = getJSON<typeof meta>(key);
    expect(back?.id).toBe("x1");
  });
});

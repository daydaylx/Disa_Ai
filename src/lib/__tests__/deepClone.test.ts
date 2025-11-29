import { describe, expect, it } from "vitest";

import { deepClone } from "../utils";

describe("deepClone", () => {
  it("should correctly clone simple objects", () => {
    const obj = { a: 1, b: "test" };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  it("should correctly clone arrays", () => {
    const arr = [1, 2, 3];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
  });

  it("should correctly clone dates", () => {
    const date = new Date();
    const cloned = deepClone(date);
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
    expect(cloned instanceof Date).toBe(true);
  });

  it("should correctly clone RegExp", () => {
    const regex = /abc/gi;
    regex.lastIndex = 5;
    const cloned = deepClone(regex);
    expect(cloned).toEqual(regex);
    expect(cloned instanceof RegExp).toBe(true);
    expect(cloned.source).toBe("abc");
    expect(cloned.flags).toBe("gi");
    expect(cloned.lastIndex).toBe(5);
  });

  it("should correctly clone Set", () => {
    const nested = { a: 1 };
    const set = new Set([nested, 2, 3]);
    const cloned = deepClone(set);
    expect(cloned).toEqual(set);
    expect(cloned instanceof Set).toBe(true);
    expect(cloned.has(nested)).toBe(false); // Should not have the same object reference

    // verify deep clone
    const clonedArr = Array.from(cloned);
    expect(clonedArr[0]).toEqual(nested);
    expect(clonedArr[0]).not.toBe(nested);
  });

  it("should correctly clone Map", () => {
    const keyObj = { k: 1 };
    const valObj = { v: 1 };
    const map = new Map<any, any>([
      [keyObj, valObj],
      ["b", 2],
    ]);
    const cloned = deepClone(map);
    expect(cloned).toEqual(map);
    expect(cloned instanceof Map).toBe(true);

    // verify deep clone of keys and values
    expect(cloned.has(keyObj)).toBe(false); // Key reference should change

    // Find the entry that corresponds to keyObj
    const clonedEntries = Array.from(cloned.entries());
    const matchedEntry = clonedEntries.find((e) => e[0].k === 1);
    expect(matchedEntry).toBeDefined();
    expect(matchedEntry![0]).not.toBe(keyObj);
    expect(matchedEntry![1]).toEqual(valObj);
    expect(matchedEntry![1]).not.toBe(valObj);
  });
});

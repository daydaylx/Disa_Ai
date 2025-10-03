import { describe, expect, it } from "vitest";

// Mock the service worker cache patterns and logic
const CACHE_PATTERNS = {
  HTML: /^html-v\d+\.\d+\.\d+-\w+$/,
  ASSETS: /^assets-v\d+\.\d+\.\d+-\w+$/,
  API: /^api-v\d+\.\d+\.\d+-\w+$/,
  USER_DATA: /^userdata-v\d+\.\d+\.\d+-\w+$/,
  STATIC: /^static-v\d+\.\d+\.\d+-\w+$/,
  DYNAMIC: /^dynamic-v\d+\.\d+\.\d+-\w+$/,
  APP_VERSIONED: /^[\w-]+-v\d+\.\d+\.\d+-\w+$/,
};

// Mock current version
const SW_VERSION = "v2.2.0-abc12345";
const CURRENT_CACHES = new Set([`html-${SW_VERSION}`, `assets-${SW_VERSION}`]);

function shouldPreserveCache(cacheName: string): boolean {
  // 1. Always preserve current version caches
  if (CURRENT_CACHES.has(cacheName)) {
    return true;
  }

  // 2. Preserve any cache matching known patterns (future compatibility)
  const isAppVersioned = Object.values(CACHE_PATTERNS).some((pattern) => pattern.test(cacheName));

  if (isAppVersioned) {
    // Extract version from cache name for intelligent cleanup
    const versionMatch = cacheName.match(/v(\d+)\.(\d+)\.(\d+)/);
    if (versionMatch) {
      const [, major, minor] = versionMatch;
      const currentVersionMatch = SW_VERSION.match(/v(\d+)\.(\d+)\.(\d+)/);

      if (currentVersionMatch) {
        const [, currentMajor, currentMinor] = currentVersionMatch;

        // Preserve caches from same major version (forwards compatibility)
        if (major === currentMajor) {
          return true;
        }

        // Only preserve older versions within 1 minor version for rollback safety
        if (major === currentMajor && parseInt(currentMinor) - parseInt(minor) <= 1) {
          return true;
        }

        // Preserve newer versions (rollback safety)
        if (
          parseInt(major) > parseInt(currentMajor) ||
          (major === currentMajor && parseInt(minor) > parseInt(currentMinor))
        ) {
          return true;
        }
      }
    }
  }

  // 3. Preserve non-versioned caches (might be from other apps or manual caches)
  if (!cacheName.includes("-v") && !cacheName.includes("workbox")) {
    return true;
  }

  return false;
}

describe("Service Worker Cache Management", () => {
  describe("shouldPreserveCache", () => {
    it("should preserve current version caches", () => {
      expect(shouldPreserveCache("html-v2.2.0-abc12345")).toBe(true);
      expect(shouldPreserveCache("assets-v2.2.0-abc12345")).toBe(true);
    });

    it("should preserve future cache types in same major version", () => {
      // Future cache types that don't exist yet
      expect(shouldPreserveCache("api-v2.2.0-def45678")).toBe(true);
      expect(shouldPreserveCache("userdata-v2.3.0-ghi78901")).toBe(true);
      expect(shouldPreserveCache("static-v2.1.5-jkl23456")).toBe(true);
    });

    it("should preserve newer versions for rollback safety", () => {
      // Newer major version
      expect(shouldPreserveCache("html-v3.0.0-xyz98765")).toBe(true);
      expect(shouldPreserveCache("assets-v3.1.0-uvw65432")).toBe(true);

      // Newer minor version in same major
      expect(shouldPreserveCache("html-v2.3.0-rst32109")).toBe(true);
      expect(shouldPreserveCache("assets-v2.5.1-opq87654")).toBe(true);
    });

    it("should preserve non-versioned caches from other sources", () => {
      // Non-app caches
      expect(shouldPreserveCache("manual-cache")).toBe(true);
      expect(shouldPreserveCache("third-party-cache")).toBe(true);
      expect(shouldPreserveCache("user-data")).toBe(true);
    });

    it("should delete old major versions", () => {
      // Old major versions should be deleted
      expect(shouldPreserveCache("html-v1.5.0-old12345")).toBe(false);
      expect(shouldPreserveCache("assets-v1.9.9-old98765")).toBe(false);
      expect(shouldPreserveCache("api-v0.8.0-ancient123")).toBe(false);
    });

    it("should delete old minor versions in different major", () => {
      // Old minor versions in older major should be deleted
      expect(shouldPreserveCache("html-v2.1.0-old12345")).toBe(false);
      expect(shouldPreserveCache("assets-v2.0.5-old98765")).toBe(false);
    });

    it("should delete workbox caches", () => {
      // Workbox versioned caches should be deleted
      expect(shouldPreserveCache("workbox-precache-v1")).toBe(false);
      expect(shouldPreserveCache("workbox-runtime-v2")).toBe(false);
    });

    it("should handle edge cases gracefully", () => {
      // Invalid version formats
      expect(shouldPreserveCache("html-invalid-version")).toBe(false);
      expect(shouldPreserveCache("assets-v-malformed")).toBe(false);

      // Empty or malformed cache names
      expect(shouldPreserveCache("")).toBe(true); // Non-versioned fallback
      expect(shouldPreserveCache("just-a-name")).toBe(true); // Non-versioned fallback
    });
  });

  describe("cache upgrade scenarios", () => {
    it("should handle v2.2 -> v2.3 upgrade safely", () => {
      const v2_3_caches = [
        "html-v2.3.0-def45678",
        "assets-v2.3.0-def45678",
        "api-v2.3.0-def45678", // New cache type
      ];

      // New API cache should be preserved even if not in old hardcoded list
      v2_3_caches.forEach((cache) => {
        // Should preserve all caches from same major version
        expect(shouldPreserveCache(cache)).toBe(true);
      });

      // Very old versions should be cleaned up
      const oldCache = "html-v1.0.0-old123";
      expect(shouldPreserveCache(oldCache)).toBe(false);
    });

    it("should handle v2.x -> v3.x major upgrade", () => {
      const v3_caches = [
        "static-v3.0.0-def45678", // New naming scheme
        "dynamic-v3.0.0-def45678",
      ];

      // New v3.x caches should be preserved despite different naming
      v3_caches.forEach((cache) => {
        expect(shouldPreserveCache(cache)).toBe(true);
      });

      // Very old major versions should be cleaned up
      const oldMajorCache = "html-v1.0.0-old123";
      expect(shouldPreserveCache(oldMajorCache)).toBe(false);
    });
  });
});

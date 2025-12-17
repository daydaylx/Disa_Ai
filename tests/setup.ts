import "@testing-library/jest-dom/vitest";

import fs from "node:fs";
import path from "node:path";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

import { ApiError } from "../src/lib/errors";

// ResizeObserver polyfill for JSDOM
// Some UI libraries expect ResizeObserver to exist in the runtime.
class ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // Trigger callback with empty entries on next tick
    setTimeout(() => {
      this.callback([], this);
    }, 0);
  }

  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver as unknown as typeof globalThis.ResizeObserver;

// IntersectionObserver polyfill for JSDOM
// Required for useIntersectionObserver hook tests
class IntersectionObserver {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  root: Element | Document | null;
  rootMargin: string;
  thresholds: ReadonlyArray<number>;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? "0px";
    const thresholdOpt = options?.threshold ?? 0;
    this.thresholds = Array.isArray(thresholdOpt) ? thresholdOpt : [thresholdOpt];
  }

  observe(target: Element) {
    // Trigger callback with intersection entry on next tick
    setTimeout(() => {
      const entry: IntersectionObserverEntry = {
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: target.getBoundingClientRect(),
        isIntersecting: true,
        rootBounds: null,
        target,
        time: Date.now(),
      };
      this.callback([entry], this);
    }, 0);
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver =
  IntersectionObserver as unknown as typeof globalThis.IntersectionObserver;

// Ensure sandboxed runners (no /tmp write access) can compile Tailwind/JITI caches.
const repoTmp = path.join(process.cwd(), ".tmp");
if (!fs.existsSync(repoTmp)) {
  fs.mkdirSync(repoTmp, { recursive: true });
}
process.env.TMPDIR ||= repoTmp;
process.env.JITI_CACHE_DIR ||= repoTmp;

// Mock performance API for consistent timing
Object.defineProperty(window, "performance", {
  value: {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
  },
  writable: true,
});

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeEach(() => {
  // Reset document body for each test
  document.body.innerHTML = "";

  // Suppress non-essential console output during tests
  console.warn = () => {};
  console.info = () => {};
});

// Clean up after each test
afterEach(() => {
  cleanup();

  // Restore original console methods
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
});

process.on("unhandledRejection", (reason) => {
  if (reason && typeof reason === "object" && reason instanceof ApiError) return;
  throw reason;
});

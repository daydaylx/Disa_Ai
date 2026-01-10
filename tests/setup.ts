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

// Canvas API polyfill for JSDOM
// Required for image processing tests that use Canvas for resizing/compression
class CanvasRenderingContext2DMock {
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  drawImage() {
    // Mock implementation - does nothing but prevents errors
  }

  // Add other 2D context methods as needed
  fillRect() {}
  clearRect() {}
  strokeRect() {}
  fillText() {}
  strokeText() {}
  measureText() {
    return { width: 0 };
  }
  getImageData() {
    return {
      data: new Uint8ClampedArray(),
      width: 0,
      height: 0,
    };
  }
  putImageData() {}
  createImageData() {
    return {
      data: new Uint8ClampedArray(),
      width: 0,
      height: 0,
    };
  }
  setTransform() {}
  resetTransform() {}
  scale() {}
  rotate() {}
  translate() {}
  transform() {}
  save() {}
  restore() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  arc() {}
  arcTo() {}
  ellipse() {}
  rect() {}
  fill() {}
  stroke() {}
  clip() {}
  isPointInPath() {
    return false;
  }
  isPointInStroke() {
    return false;
  }
}

if (typeof HTMLCanvasElement !== "undefined") {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    contextType: string,
    options?: any,
  ): CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | null {
    if (contextType === "2d") {
      return new CanvasRenderingContext2DMock(this) as unknown as CanvasRenderingContext2D;
    }
    if (originalGetContext) {
      return originalGetContext.call(this, contextType, options) as any;
    }
    return null;
  } as any;
}

// Mock HTMLCanvasElement
const originalCreateElement = document.createElement.bind(document);
document.createElement = function (tagName: string, options?: ElementCreationOptions) {
  if (tagName.toLowerCase() === "canvas") {
    const canvas = originalCreateElement("canvas", options) as HTMLCanvasElement;

    // Mock getContext to return our mock 2D context
    canvas.getContext = function (
      this: HTMLCanvasElement,
      contextType: string,
      _options?: any,
    ): CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | null {
      if (contextType === "2d") {
        return new CanvasRenderingContext2DMock(this) as unknown as CanvasRenderingContext2D;
      }
      return null;
    } as any;

    // Mock toDataURL to return a valid base64 data URL
    canvas.toDataURL = function (type?: string, _quality?: any): string {
      // Return a minimal valid JPEG data URL (1x1 red pixel)
      const base64 =
        "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==";
      return `data:${type || "image/png"};base64,${base64}`;
    };

    // Set default dimensions
    Object.defineProperty(canvas, "width", {
      value: 300,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(canvas, "height", {
      value: 150,
      writable: true,
      configurable: true,
    });

    return canvas;
  }
  return originalCreateElement(tagName, options);
} as typeof document.createElement;

// Mock URL.createObjectURL and URL.revokeObjectURL for image loading
if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = () => "blob:mock-url";
}
if (!globalThis.URL.revokeObjectURL) {
  globalThis.URL.revokeObjectURL = () => {};
}

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

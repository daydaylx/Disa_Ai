import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

import { ApiError } from "../src/lib/errors";

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

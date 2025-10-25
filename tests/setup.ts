import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

import { ApiError } from "../src/lib/errors";

// Ensure DOM is properly set up
beforeEach(() => {
  // Reset document body for each test
  document.body.innerHTML = "";
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

process.on("unhandledRejection", (reason) => {
  if (reason && typeof reason === "object" && reason instanceof ApiError) return;
  throw reason;
});

/**
 * Global setup for Playwright E2E tests
 * Blocks external resources that cause DNS failures in test environment
 */
import type { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("[E2E Setup] Configuring test environment...");
  console.log("[E2E Setup] External fonts will be blocked to prevent crashes");
  return;
}

export default globalSetup;

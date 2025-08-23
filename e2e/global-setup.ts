import type { FullConfig } from "@playwright/test";

export default async function globalSetup(_config: FullConfig) {
  try {
    // Falls Vitest/expect zuvor irgendwo geladen wurde: Marker entfernen, damit Playwright-Expect kollisionsfrei ist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any)[Symbol.for("$$jest-matchers-object")];
  } catch {
    // noop
  }
}

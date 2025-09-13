import { expect, test } from "@playwright/test";

import { setupRequestInterception } from "./setup/intercept";

test("Smoke: Prompt → Response (offline, SSE)", async ({ page }) => {
  // Ensure no real network and mock streaming success
  await setupRequestInterception(page, "success");

  // Force API-Key so App benutzt Netzwerkpfad (nicht Demo-Fallback)
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("OPENROUTER_API_KEY", "test");
    } catch {}
  });

  await page.goto("/#/");

  await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 5000 });

  const input = page.getByTestId("composer-input");
  await input.fill("Hallo Welt");
  await page.getByTestId("composer-send").click();

  // Erwartung: neue Assistant-Bubble mit gestreamtem Text
  await expect(page.locator(".chat-bubble").last()).toContainText("Offline-Testantwort");
});

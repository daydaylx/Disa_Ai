import { expect, test } from "@playwright/test";

import { setupRequestInterception } from "./setup/intercept";

test("Smoke: Prompt → Response (offline, SSE)", async ({ page }) => {
  // Ensure no real network and mock streaming success
  await setupRequestInterception(page, "success");

  // Force API-Key and model so App uses network path (not demo fallback)
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("OPENROUTER_API_KEY", "test-api-key");
      localStorage.setItem("disa_model", "meta-llama/llama-3.3-70b-instruct:free");
      console.log("[E2E] API key and model set");
    } catch (e) {
      console.error("[E2E] Failed to set API key/model:", e);
    }
  });

  await page.goto("/#/");

  await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 5000 });

  // Debug: Check if API key is properly set
  const apiKeyCheck = await page.evaluate(() => {
    const key = sessionStorage.getItem("OPENROUTER_API_KEY");
    const model = localStorage.getItem("disa_model");
    console.log("[E2E Debug] API Key:", key);
    console.log("[E2E Debug] Model:", model);
    return { key, model };
  });
  console.log("[E2E Debug] Storage check:", apiKeyCheck);

  const input = page.getByTestId("composer-input");
  await input.fill("Hallo Welt");
  await page.getByTestId("composer-send").click();

  // Erwartung: neue Assistant-Bubble mit gestreamtem Text
  await expect(page.locator(".chat-bubble").last()).toContainText("Offline-Testantwort");
});

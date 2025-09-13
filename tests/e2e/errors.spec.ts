import { expect, test } from "@playwright/test";

import { setupRequestInterception } from "./setup/intercept";

test("Fehler: RateLimit (429) → Toast", async ({ page }) => {
  await setupRequestInterception(page, "rate-limit");
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("OPENROUTER_API_KEY", "test-api-key");
      localStorage.setItem("disa_model", "meta-llama/llama-3.3-70b-instruct:free");
    } catch {}
  });

  await page.goto("/#/");
  await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 5000 });
  await page.getByTestId("composer-input").fill("trigger rate limit");
  await page.getByTestId("composer-send").click();

  await expect(page.locator("#toasts-portal")).toContainText("Rate-Limit erreicht");
});

test("Fehler: Serverfehler (5xx) → Toast", async ({ page }) => {
  await setupRequestInterception(page, "server-error");
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("OPENROUTER_API_KEY", "test-api-key");
      localStorage.setItem("disa_model", "meta-llama/llama-3.3-70b-instruct:free");
    } catch {}
  });

  await page.goto("/#/");
  await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 5000 });
  await page.getByTestId("composer-input").fill("trigger server error");
  await page.getByTestId("composer-send").click();

  await expect(page.locator("#toasts-portal")).toContainText("Serverfehler beim Anbieter");
});

test("Fehler: Timeout/Netzwerk → Toast", async ({ page }) => {
  await setupRequestInterception(page, "timeout");
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("OPENROUTER_API_KEY", "test-api-key");
      localStorage.setItem("disa_model", "meta-llama/llama-3.3-70b-instruct:free");
    } catch {}
  });

  await page.goto("/#/");
  await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 5000 });
  await page.getByTestId("composer-input").fill("trigger timeout");
  await page.getByTestId("composer-send").click();

  await expect(page.locator("#toasts-portal")).toContainText("Netzwerkfehler");
});

test("Fehler: Nutzer-Abbruch (Stop) → Toast", async ({ page }) => {
  await setupRequestInterception(page, "success");
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("OPENROUTER_API_KEY", "test-api-key");
      localStorage.setItem("disa_model", "meta-llama/llama-3.3-70b-instruct:free");
    } catch {}
  });

  await page.goto("/#/");
  await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 5000 });
  await page.getByTestId("composer-input").fill("bitte stoppen");
  await page.getByTestId("composer-send").click();
  // Sofort stoppen, um AbortError zu provozieren
  await page.getByTestId("composer-stop").click();

  await expect(page.locator("#toasts-portal")).toContainText("Anfrage abgebrochen");
});

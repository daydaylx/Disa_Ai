import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Router Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page);
  });

  test("AppShell shows Header und Bottom-Navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Disa AI" })).toBeVisible();
    await expect(page.getByTestId("nav.chat")).toBeVisible();
    await expect(page.getByTestId("nav.models")).toBeVisible();
    await expect(page.getByTestId("nav.settings")).toBeVisible();
  });

  test("Direktaufruf /chat zeigt Chat-Inhalt", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL("/chat");
    await expect(page.getByTestId("composer-input")).toBeVisible();
  });

  test("Direktaufruf /models zeigt Modellübersicht", async ({ page }) => {
    await page.goto("/models");
    await expect(page.getByRole("heading", { name: "Modelle & Rollen" })).toBeVisible();
  });

  test("Direktaufruf /settings zeigt Einstellungen", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: /Einstellungen|Settings/ })).toBeVisible();
  });

  test("Navigation über die unteren Tabs", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav.models").click();
    await expect(page).toHaveURL("/models");
    await page.getByTestId("nav.settings").click();
    await expect(page).toHaveURL("/settings");
    await page.getByTestId("nav.chat").click();
    await expect(page).toHaveURL("/chat");
  });

  test("should redirect root / to chat page", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("composer-input")).toBeVisible();
  });

  test("should maintain navigation state across route changes", async ({ page }) => {
    await page.goto("/chat");

    // Navigate to models
    await page.getByTestId("nav.models").click();
    await expect(page).toHaveURL("/models");

    await expect(page.getByRole("heading", { name: "Modelle & Rollen" })).toBeVisible();

    // Navigate to settings
    await page.getByTestId("nav.settings").click();
    await expect(page).toHaveURL("/settings");

    await expect(page.getByRole("heading", { name: /Einstellungen|Settings/ })).toBeVisible();
  });

  // KRITISCHE TESTS für Redirect-Loop Fix
  test("should handle page reload without redirect loops", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByTestId("composer-input")).toBeVisible();

    // Reload simulieren (kritisch für Cloudflare Pages)
    await page.reload();
    await expect(page).toHaveURL("/chat");
    await expect(page.getByTestId("composer-input")).toBeVisible();
  });

  test("should handle deep link reload on all routes", async ({ page }) => {
    const routes = ["/chat", "/models", "/settings"];

    for (const route of routes) {
      await page.goto(route);

      // Erste Ladung prüfen
      await expect(page).toHaveURL(route);

      // Reload simulieren
      await page.reload();
      await expect(page).toHaveURL(route);

      // Sicherstellen, dass keine white screen/redirect loops auftreten
      await expect(page.locator("body")).not.toBeEmpty();
    }
  });

  test("should handle invalid routes without loops", async ({ page }) => {
    await page.goto("/invalid-route");

    // Sollte zu /chat redirecten (nicht zu "/" um Loops zu vermeiden)
    await expect(page).toHaveURL("/chat");
    await expect(page.getByTestId("composer-input")).toBeVisible();
  });

  test("should work with direct URL access after deployment", async ({ page }) => {
    // Simuliert den Production-Case: Direkter Aufruf einer Route
    await page.goto("/models?debug=production-test");
    await expect(page).toHaveURL("/models?debug=production-test");
    await expect(page.getByRole("heading", { name: "Modelle & Rollen" })).toBeVisible();

    // Reload mit Query-Parameter
    await page.reload();
    await expect(page).toHaveURL("/models?debug=production-test");
  });
});

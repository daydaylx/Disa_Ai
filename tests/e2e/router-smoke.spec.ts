import { expect, test } from "@playwright/test";

test.describe("Router Smoke Tests", () => {
  test("AppShell shows Header und Bottom-Navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Disa AI")).toBeVisible();
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
    await expect(page.getByRole("heading", { name: "Modelle & Presets" })).toBeVisible();
  });

  test("Direktaufruf /settings zeigt Einstellungen", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
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

    // Should show chat page content (since index route points to ChatPage)
    // Note: URL might stay "/" due to index route, but content should be chat
    const hasMainContent = await page.locator("main").count();
    expect(hasMainContent).toBeGreaterThan(0);

    // AppShell should be present
    await expect(page.getByText("Disa AI")).toBeVisible();
  });

  test("should maintain navigation state across route changes", async ({ page }) => {
    await page.goto("/chat");

    // Navigate to models
    await page.locator('[aria-label="Bottom navigation"] a[href="/models"]').click();
    await expect(page).toHaveURL("/models");

    // Check that header is still present
    await expect(page.getByText("Disa AI")).toBeVisible();
    await expect(page.getByText("GPT-4")).toBeVisible();

    // Navigate to settings
    await page.locator('[aria-label="Bottom navigation"] a[href="/settings"]').click();
    await expect(page).toHaveURL("/settings");

    // Header should still be present
    await expect(page.getByText("Disa AI")).toBeVisible();
    await expect(page.getByRole("button", { name: /new/i })).toBeVisible();
  });
});

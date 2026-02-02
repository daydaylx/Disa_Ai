import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

test.describe("Book Concept UI", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("/");
    // Wait for initial load
    await page.waitForLoadState("networkidle");
  });

  test("should display the Book Layout correctly", async ({ page }) => {
    // Check for Hamburger Menu
    await expect(page.locator('button[aria-label="Menü öffnen"]')).toBeVisible();

    // Check for History trigger
    await expect(page.locator('button[aria-label="Verlauf öffnen"]')).toBeVisible();

    // Check for Unified Input Bar
    const input = page.getByTestId("composer-input");
    await expect(input).toBeVisible();
  });

  test("should allow typing and sending a message", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    await input.fill("Hello Book World");

    const sendButton = page.locator('button[aria-label="Senden"]');
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();
    await sendButton.click({ force: true });

    // Verify user message bubble appears
    await expect(page.getByText("Hello Book World")).toBeVisible();
  });

  test("should open History Panel via history trigger", async ({ page }) => {
    const historyTrigger = page.locator('button[aria-label="Verlauf öffnen"]');
    await historyTrigger.click();

    // Prefer the actual history panel dialog (avoid picking other complementary regions)
    const historyPanel = page.getByRole("dialog").filter({ hasText: "Inhaltsverzeichnis" });
    await expect(historyPanel).toBeVisible();
    await expect(historyPanel.getByRole("button", { name: "Chat‑Verlauf" })).toBeVisible();
    await expect(historyPanel.getByRole("button", { name: "Archiv" })).toBeVisible();

    // Close it by clicking outside
    await page.mouse.click(10, 10);
  });

  test("should open Main Menu via Hamburger", async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.click();

    // Menu Drawer should be visible
    const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(drawer).toBeVisible();

    // Check links
    await expect(drawer.getByText("Einstellungen")).toBeVisible();
    await expect(drawer.getByText("Impressum")).toBeVisible();

    // Close menu
    const closeButton = drawer.locator('button[aria-label="Menü schließen"]');
    await closeButton.click();
    await expect(drawer).not.toBeVisible();
  });
});

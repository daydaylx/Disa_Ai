import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

test.describe("Chat Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("/");
    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");
  });

  test("should load chat interface with key elements", async ({ page }) => {
    // Check for main menu button
    await expect(page.locator('button[aria-label="Menü öffnen"]')).toBeVisible();

    // Check for history/bookmark button
    await expect(page.locator('button[aria-label="Verlauf öffnen"]')).toBeVisible();

    // Check for composer input
    const input = page.getByTestId("composer-input");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("aria-label", "Nachricht eingeben");

    // Check for send button
    const sendButton = page.locator('button[aria-label="Senden"]');
    await expect(sendButton).toBeVisible();

    // Check for role selector (shows "Standard" by default)
    const roleButton = page.locator("button").filter({ hasText: /Standard/i });
    await expect(roleButton).toBeVisible();

    // Check for style selector
    const styleSelector = page.locator('button[aria-label="Stil auswählen"]');
    await expect(styleSelector).toBeVisible();

    // Check for creativity selector
    const creativitySelector = page.locator('button[aria-label="Kreativität auswählen"]');
    await expect(creativitySelector).toBeVisible();
  });

  test("should allow typing and sending a message", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    await input.fill("Test message");

    const sendButton = page.locator('button[aria-label="Senden"]');
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // Input should be cleared after sending
    await expect(input).toHaveValue("");
  });

  test("should open main menu", async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.click();

    // Menu drawer should be visible
    const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(menuDrawer).toBeVisible();

    // Check for navigation links
    await expect(menuDrawer.getByText("Einstellungen")).toBeVisible();
    await expect(menuDrawer.getByText("Impressum")).toBeVisible();

    // Close menu
    const closeButton = menuDrawer.locator('button[aria-label="Menü schließen"]');
    await closeButton.click();
    await expect(menuDrawer).not.toBeVisible();
  });

  test("should open history panel", async ({ page }) => {
    const historyButton = page.locator('button[aria-label="Verlauf öffnen"]');
    await historyButton.click();

    // History panel should be visible
    const historyPanel = page.getByRole("complementary").or(page.getByRole("dialog")).first();
    await expect(historyPanel).toBeVisible();

    // Check for tabs
    await expect(historyPanel.getByText("Lesezeichen")).toBeVisible();
    await expect(historyPanel.getByText("Archiv")).toBeVisible();

    // Close panel by clicking outside
    await page.mouse.click(10, 10);
  });

  test("should navigate to roles selection", async ({ page }) => {
    // Click on role selector (shows "Standard" by default)
    const roleButton = page.locator("button").filter({ hasText: /Standard/i });
    await roleButton.click();

    // Should navigate to roles page
    await expect(page).toHaveURL(/\/roles/);

    // Check for roles header
    await expect(page.getByRole("heading", { level: 1, name: /Rollen/i })).toBeVisible();
  });

  test("should send message with Enter key", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    await input.fill("Test with Enter");

    // Send with Enter
    await input.press("Enter");

    // Input should be cleared
    await expect(input).toHaveValue("");
  });

  test("should handle disabled send button with empty input", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    const sendButton = page.locator('button[aria-label="Senden"]');

    // Send button should be disabled with empty input
    await expect(input).toHaveValue("");
    await expect(sendButton).toBeDisabled();

    // Button should be enabled with text
    await input.fill("Some text");
    await expect(sendButton).toBeEnabled();
  });
});

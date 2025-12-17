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

    // Check for Bookmark (History trigger)
    await expect(page.locator('button[aria-label="Verlauf öffnen"]')).toBeVisible();

    // Check for Unified Input Bar
    const input = page.getByTestId("composer-input");
    await expect(input).toBeVisible();

    // Check for role selector (primary pill - shows "Standard" by default)
    const roleButton = page.locator("button").filter({ hasText: /Standard/i });
    await expect(roleButton).toBeVisible();

    // Check for style selector
    await expect(page.locator('button[aria-label="Stil auswählen"]')).toBeVisible();

    // Check for creativity selector
    await expect(page.locator('button[aria-label="Kreativität auswählen"]')).toBeVisible();
  });

  test("should allow typing and sending a message", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    await input.fill("Hello Book World");

    const sendButton = page.locator('button[aria-label="Senden"]');
    await expect(sendButton).toBeVisible();
    await sendButton.click();

    // Check if message appears in the list
    // Note: In a real app without backend mock, this might fail if API fails.
    // But we assume the frontend optimistically adds it or we mock the API.
    // For now, we check if the input is cleared, which indicates 'send' was triggered.
    await expect(input).toHaveValue("");

    // Verify user message bubble appears
    await expect(page.getByText("Hello Book World")).toBeVisible();
  });

  test("should open and interact with Control Bar", async ({ page }) => {
    // Click on style selector
    const styleControl = page.locator('button[aria-label="Stil auswählen"]');
    await styleControl.click();

    // Check for style options
    const styleOption = page.getByRole("option", { name: "Locker & neugierig" });
    await expect(styleOption).toBeVisible();
    await styleOption.click();

    // Click on creativity selector
    const creativityControl = page.locator('button[aria-label="Kreativität auswählen"]');
    await creativityControl.click();

    // Check for creativity options
    const creativeLevel = page.getByRole("option", { name: /Kreativ/i });
    await expect(creativeLevel).toBeVisible();
    await creativeLevel.click();
  });

  test("should open History Panel via Bookmark", async ({ page }) => {
    const bookmark = page.locator('button[aria-label="Verlauf öffnen"]');
    await bookmark.click();

    // Prefer the actual history panel dialog (avoid picking other complementary regions)
    const historyPanel = page.getByRole("dialog").filter({ hasText: "Inhaltsverzeichnis" });
    await expect(historyPanel).toBeVisible();
    await expect(historyPanel.getByText("Lesezeichen")).toBeVisible();
    await expect(historyPanel.getByText("Archiv")).toBeVisible();

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

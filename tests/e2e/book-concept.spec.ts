import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

test.describe("Book Concept UI", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("/");
    // Wait for initial load (avoid networkidle flakiness with SW/PWA)
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("composer-input")).toBeVisible({ timeout: 30000 });
  });

  test("should display the Book Layout correctly", async ({ page }) => {
    // Check for Hamburger Menu
    await expect(page.locator('button[aria-label="Menü öffnen"]')).toBeVisible();

    // History is available via the drawer on empty chat state
    await page.locator('button[aria-label="Menü öffnen"]').click();
    const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: /^Verlauf\b/i })).toBeVisible();
    await page.locator('button[aria-label="Menü schließen"]').click();

    // Check for Unified Input Bar
    const input = page.getByTestId("composer-input");
    await expect(input).toBeVisible();

    // Check for role selector
    const roleButton = page.locator('button[aria-label="Rolle auswählen"]');
    await expect(roleButton).toBeVisible();

    // Additional controls are behind "Mehr Optionen"
    const extraControlsToggle = page.locator('button[title="Mehr Optionen"]');
    await expect(extraControlsToggle).toBeVisible();
    await extraControlsToggle.click();

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
    await expect(sendButton).toBeEnabled();
    await sendButton.click({ force: true });

    // Check if message appears in the list
    // Note: In a real app without backend mock, this might fail if API fails.
    // But we assume the frontend optimistically adds it or we mock the API.
    // For now, we check if the input is cleared, which indicates 'send' was triggered.
    await expect(input).toHaveValue("");

    // Verify user message bubble appears
    await expect(page.getByTestId("message-list").getByText("Hello Book World")).toBeVisible();
  });

  test("should open and interact with Control Bar", async ({ page }) => {
    // Open secondary controls first
    await page.locator('button[title="Mehr Optionen"]').click();

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

  test("should open History page via navigation menu", async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.click();

    const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(drawer).toBeVisible();

    const historyLink = drawer.getByRole("link", { name: /^Verlauf\b/i });
    await expect(historyLink).toBeVisible();
    await historyLink.click();

    await expect(page).toHaveURL(/\/chat\/history/);
    await expect(page.getByRole("heading", { name: /Gespeicherte Unterhaltungen/i })).toBeVisible();
  });

  test("should open Main Menu via Hamburger", async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.click();

    // Menu Drawer should be visible
    const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(drawer).toBeVisible();

    // Check links
    await expect(drawer.getByRole("link", { name: /^Verlauf\b/i })).toBeVisible();
    await expect(drawer.getByRole("link", { name: /^Impressum\b/i })).toBeVisible();

    // Close menu
    const closeButton = drawer.locator('button[aria-label="Menü schließen"]');
    await closeButton.click();
    await expect(drawer).not.toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

test.describe("Book Concept UI", () => {
  test.beforeEach(async ({ page }) => {
    // Simulate mobile or desktop - Playwright config usually handles this but we can ensure basics
    await page.goto("/");
    // Wait for initial load
    await page.waitForLoadState("networkidle");
  });

  test("should display the Book Layout correctly", async ({ page }) => {
    // Check for Hamburger Menu
    await expect(page.locator('button[aria-label="Hauptmenü öffnen"]')).toBeVisible();

    // Check for Bookmark (History trigger)
    await expect(page.locator('button[aria-label="Verlauf öffnen"]')).toBeVisible();

    // Check for Unified Input Bar
    const input = page.getByTestId("composer-input");
    await expect(input).toBeVisible();

    // Check for Settings Dropup Trigger
    await expect(page.locator('button[aria-label="Chat Einstellungen"]')).toBeVisible();
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

  test("should open and interact with Settings Dropup", async ({ page }) => {
    const settingsButton = page.locator('button[aria-label="Chat Einstellungen"]');
    await settingsButton.click();

    // Dropup should be visible
    const dropup = page.locator(".z-popover"); // Based on class used in ChatSettingsDropup
    await expect(dropup).toBeVisible();

    // Check for sections
    await expect(dropup.getByText("Modell")).toBeVisible();
    await expect(dropup.getByText("Rolle")).toBeVisible();
    await expect(dropup.getByText("Stil")).toBeVisible();

    // Select a style (e.g., "Kreativ")
    const creativeOption = dropup.getByRole("button", { name: "Kreativ" });
    await creativeOption.click();

    // Dropup should close
    await expect(dropup).not.toBeVisible();
  });

  test("should open History Panel via Bookmark", async ({ page }) => {
    const bookmark = page.locator('button[aria-label="Verlauf öffnen"]');
    await bookmark.click();

    // History Panel should be visible
    const historyPanel = page.getByRole("dialog");
    await expect(historyPanel).toBeVisible();
    await expect(historyPanel.getByText("Inhaltsverzeichnis")).toBeVisible();
    await expect(historyPanel.getByText("Lesezeichen")).toBeVisible();
    await expect(historyPanel.getByText("Archiv")).toBeVisible();

    // Close it

    // Or click backdrop
    await page.mouse.click(10, 10); // Click somewhere outside if backdrop covers screen
    // Alternatively use the close button if identifiable
    // await closeButton.click();
  });

  test("should open Main Menu via Hamburger", async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Hauptmenü öffnen"]');
    await menuButton.click();

    // Menu Drawer should be visible
    const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(drawer).toBeVisible();

    // Check links
    await expect(drawer.getByText("Einstellungen")).toBeVisible();
    await expect(drawer.getByText("Impressum")).toBeVisible();
  });
});

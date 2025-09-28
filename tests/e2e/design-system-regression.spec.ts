import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Design System Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page);
  });

  test("Chat interface loads without errors", async ({ page }) => {
    await page.goto("/");

    // Wait for basic elements to load
    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Check basic UI elements exist
    await expect(page.getByTestId("composer-input")).toBeVisible();
    await expect(page.getByText("Disa AI")).toBeVisible();

    // Test basic input functionality
    await page.getByTestId("composer-input").fill("Test message");
    await expect(page.getByTestId("composer-input")).toHaveValue("Test message");
  });

  test("Glass components render correctly", async ({ page }) => {
    await page.goto("/");

    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Test that main components are present
    const pageTitle = page.getByText("Disa AI");
    await expect(pageTitle).toBeVisible();

    // Test composer input styling
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible();

    // Test send button
    const sendButton = page.getByTestId("composer-send");
    await expect(sendButton).toBeVisible();
  });

  test("Mobile viewport compatibility", async ({ page }) => {
    // Set mobile viewport (390x844 as per professional standards)
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/");

    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Ensure mobile-optimized layout works
    await expect(page.getByTestId("composer-input")).toBeVisible();
    await expect(page.getByText("Disa AI")).toBeVisible();

    // Test mobile input functionality
    await page.getByTestId("composer-input").fill("Mobile test");
    await expect(page.getByTestId("composer-input")).toHaveValue("Mobile test");
  });

  test("Settings view accessibility", async ({ page }) => {
    await page.goto("/#/settings");

    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Basic settings page functionality
    const settingsTitle = page.getByRole("heading", { name: "Settings" });
    await expect(settingsTitle).toBeVisible();
  });

  test("Button states and interactions", async ({ page }) => {
    await page.goto("/");

    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Test send button states
    const sendButton = page.getByTestId("composer-send");
    const input = page.getByTestId("composer-input");

    // Button should be present
    await expect(sendButton).toBeVisible();

    // Add text to enable button
    await input.fill("Test");
    await expect(sendButton).toBeEnabled();

    // Test hover states (basic interaction test)
    await sendButton.hover();
    await expect(sendButton).toBeVisible(); // Still visible after hover
  });
});

test.describe("Accessibility Features", () => {
  test("Keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Test basic keyboard navigation
    await page.keyboard.press("Tab");
    const focusedElement = await page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("Focus management is proper", async ({ page }) => {
    await page.goto("/");

    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Test that focus is properly managed
    const composer = page.getByTestId("composer-input");
    await composer.focus();
    await expect(composer).toBeFocused();
  });
});

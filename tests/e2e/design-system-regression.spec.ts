import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Design System Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page);
  });

  test("Chat interface loads without errors", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Check basic UI elements exist
    const composerInput = page.getByTestId("composer-input");
    await expect(composerInput).toBeVisible();
    await expect(page.getByTestId("app-title")).toBeVisible();

    const micButton = page.getByTestId("composer-mic");
    await expect(micButton).toBeVisible();
    await expect(micButton).toBeDisabled();

    // Test basic input functionality
    await composerInput.fill("Test message");
    await expect(composerInput).toHaveValue("Test message");
    await expect(page.getByTestId("composer-send")).toBeVisible();
  });

  test("Glass components render correctly", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Test that main components are present
    const pageTitle = page.getByRole("heading", { name: "Disa AI" });
    await expect(pageTitle).toBeVisible();

    // Test composer input styling
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible();

    // Initially show mic button, then send button after input
    const micButton = page.getByTestId("composer-mic");
    await expect(micButton).toBeVisible();

    await composer.fill("Test");
    const sendButton = page.getByTestId("composer-send");
    await expect(sendButton).toBeVisible();
  });

  test("Mobile viewport compatibility", async ({ page }) => {
    // Set mobile viewport (390x844 as per professional standards)
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Ensure mobile-optimized layout works
    await expect(page.getByTestId("composer-input")).toBeVisible();
    await expect(page.getByTestId("app-title")).toBeVisible();

    // Test mobile input functionality
    await page.getByTestId("composer-input").fill("Mobile test");
    await expect(page.getByTestId("composer-input")).toHaveValue("Mobile test");
  });

  test("Settings view accessibility", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /Einstellungen|Settings/ })).toBeVisible();
  });

  test("Button states and interactions", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    // Test send button states
    const input = page.getByTestId("composer-input");
    const micButton = page.getByTestId("composer-mic");

    await expect(micButton).toBeVisible();
    await expect(micButton).toBeDisabled();

    await input.fill("Test");
    await expect(input).toHaveValue("Test");

    const sendButton = page.getByTestId("composer-send");
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();
  });
});

test.describe("Accessibility Features", () => {
  test("Keyboard navigation works", async ({ page }) => {
    await page.goto("/");

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

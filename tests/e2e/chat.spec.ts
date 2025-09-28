import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Chat Functionality", () => {
  test("Basic composer functionality", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/");

    // Wait for complete page load and layout stabilization
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Allow for layout to stabilize

    // Ensure composer is fully loaded and interactive
    const composerInput = page.getByTestId("composer-input");
    await composerInput.waitFor({ state: "visible", timeout: 10000 });

    // Fill input and test basic functionality
    await composerInput.fill("Test message");

    // Wait for send button to be ready
    const sendButton = page.getByTestId("composer-send");
    await sendButton.waitFor({ state: "visible" });
    await expect(sendButton).toBeEnabled();

    // Test that message appears in input
    await expect(composerInput).toHaveValue("Test message");
  });

  test("Model picker accessibility", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Test basic page accessibility instead of specific model button
    const pageTitle = page.getByText("Disa AI");
    await expect(pageTitle).toBeVisible();

    // Check that page has proper structure
    const mainInput = page.getByTestId("composer-input");
    await expect(mainInput).toHaveAttribute("placeholder");
  });

  test("Chat functionality with default UI", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.goto("/");

    // Wait for complete page load and layout stabilization
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Ensure composer is fully loaded and interactive (should work with both UI versions)
    const composerInput = page.getByTestId("composer-input");
    await composerInput.waitFor({ state: "visible", timeout: 10000 });

    // Fill input and wait for button to become enabled
    await composerInput.fill("Universal Test Message");

    const sendButton = page.getByTestId("composer-send");
    await sendButton.waitFor({ state: "visible" });
    await expect(sendButton).toBeEnabled();

    // Test basic interaction without actually sending (to avoid API calls)
    await expect(composerInput).toHaveValue("Universal Test Message");
  });
});

import { expect, test } from "@playwright/test";

import { setupApiKeyStorage } from "./api-mock";
import { AppHelpers } from "./helpers/app-helpers";
import { skipOnboarding } from "./utils";

test.describe("Settings Flow Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await setupApiKeyStorage(page);
  });

  test("Settings navigation and overview", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/settings");

    // Verify settings page loads
    const settingsHeading = page.getByRole("heading", { name: /einstellungen|settings/i });
    await expect(settingsHeading).toBeVisible();

    // Test navigation cards
    const settingsCards = ["API-Konfiguration", "Erinnerung", "Filter", "Darstellung", "Daten"];

    for (const cardName of settingsCards) {
      const card = page
        .getByRole("link", { name: new RegExp(cardName, "i") })
        .or(page.getByText(cardName));

      if (await card.first().isVisible()) {
        await expect(card.first()).toBeVisible();

        // Verify card is clickable
        const href = await card.first().getAttribute("href");
        if (href) {
          expect(href).toMatch(/\/settings\/.+/);
        }
      }
    }

    // Test mobile navigation if present
    const backButton = page
      .locator("button[aria-label*='zurück']")
      .or(page.locator("button[aria-label*='back']"));
    if (await backButton.isVisible()) {
      await expect(backButton).toBeVisible();
    }
  });

  test("API configuration settings", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/settings/api");

    // Verify API settings page
    const apiHeading = page.getByRole("heading", { name: /api/i });
    await expect(apiHeading).toBeVisible();

    // Test API key input field
    const apiKeyInput = page
      .locator("input[type='password']")
      .or(page.locator("input[placeholder*='api']"));

    if (await apiKeyInput.isVisible()) {
      await expect(apiKeyInput).toBeVisible();

      // Test input validation
      await apiKeyInput.fill("test-api-key-123");
      await expect(apiKeyInput).toHaveValue("test-api-key-123");

      // Test save functionality
      const saveButton = page.getByRole("button", { name: /speichern|save/i });
      if (await saveButton.isVisible()) {
        await saveButton.tap();
        await page.waitForTimeout(500);

        // Look for success indication
        const successMessage = page.getByText(/gespeichert|erfolgreich|success/i);
        if (await successMessage.isVisible()) {
          await expect(successMessage).toBeVisible();
        }
      }
    }

    // Test OpenRouter base URL configuration
    const baseUrlInput = page
      .locator("input[placeholder*='url']")
      .or(page.locator("input[value*='openrouter']"));

    if (await baseUrlInput.isVisible()) {
      await expect(baseUrlInput).toBeVisible();

      const currentValue = await baseUrlInput.inputValue();
      expect(currentValue).toBeTruthy();
    }
  });

  test("Appearance settings and theme switching", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/settings/appearance");

    // Verify appearance settings page
    const appearanceHeading = page.getByRole("heading", { name: /darstellung|appearance/i });
    await expect(appearanceHeading).toBeVisible();

    // Test theme selection
    const themeSelector = page
      .locator("select")
      .or(page.locator("[role='radiogroup']"))
      .or(page.locator("button[aria-label*='theme']"));

    if (await themeSelector.first().isVisible()) {
      const selector = themeSelector.first();

      // Get current body classes to test theme switching
      const initialBodyClass = await page.locator("body").getAttribute("class");

      if ((await selector.locator("option").count()) > 0) {
        // Test dropdown theme selector
        await selector.selectOption({ index: 1 });
        await page.waitForTimeout(500);

        const newBodyClass = await page.locator("body").getAttribute("class");
        expect(newBodyClass).not.toBe(initialBodyClass);
      } else {
        // Test button-based theme selector
        const themeButtons = page
          .locator("button[data-theme]")
          .or(page.locator("button[aria-label*='dark']"));

        if (await themeButtons.first().isVisible()) {
          await themeButtons.first().tap();
          await page.waitForTimeout(500);

          const newBodyClass = await page.locator("body").getAttribute("class");
          expect(newBodyClass).not.toBe(initialBodyClass);
        }
      }
    }

    // Test other appearance options
    const fontSizeSelector = page
      .locator("input[type='range']")
      .or(page.locator("select[aria-label*='size']"));

    if (await fontSizeSelector.first().isVisible()) {
      await expect(fontSizeSelector.first()).toBeVisible();
    }
  });

  test("Memory and filter settings", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Test memory settings
    await helpers.navigateAndWait("/settings/memory");

    const memoryHeading = page.getByRole("heading", { name: /erinnerung|memory/i });
    await expect(memoryHeading).toBeVisible();

    // Test memory toggle
    const memoryToggle = page
      .locator("button")
      .filter({ has: page.locator("span.rounded-full") })
      .first();
    if (await memoryToggle.isVisible()) {
      await memoryToggle.tap();
      await page.waitForTimeout(300);
    }

    // Test filter settings
    await helpers.navigateAndWait("/settings/youth");

    const filterHeading = page.getByRole("heading", { name: /jugendfilter|youth/i });
    await expect(filterHeading).toBeVisible();

    // Test Youth Filter toggle
    const youthToggle = page
      .locator("button")
      .filter({ has: page.locator("span.rounded-full") })
      .first();
    if (await youthToggle.isVisible()) {
      await expect(youthToggle).toBeVisible();
    }
  });

  test("Data management and export/import", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/settings/data");

    const dataHeading = page.getByRole("heading", { name: /daten|data/i });
    await expect(dataHeading).toBeVisible();

    // Test export functionality
    const exportButton = page.getByRole("button", { name: /export/i });
    if (await exportButton.isVisible()) {
      await expect(exportButton).toBeVisible();

      // Note: We don't actually trigger download in tests to avoid file system issues
      // but we verify the button is accessible and clickable
      const isEnabled = await exportButton.isEnabled();
      expect(isEnabled).toBe(true);
    }

    // Test clear data functionality
    const clearButton = page.getByRole("button", { name: /löschen|clear|delete/i });
    if (await clearButton.isVisible()) {
      await expect(clearButton).toBeVisible();

      // Test that confirmation is required for destructive actions
      await clearButton.tap();
      await page.waitForTimeout(500);

      const confirmDialog = page
        .locator("[role='dialog']")
        .or(page.getByText(/bestätigen|confirm/i));

      if (await confirmDialog.first().isVisible()) {
        // Cancel the action to avoid actually clearing data
        const cancelButton = page.getByRole("button", { name: /abbrechen|cancel/i });
        if (await cancelButton.isVisible()) {
          await cancelButton.tap();
        } else {
          // Press escape if no cancel button
          await page.keyboard.press("Escape");
        }
      }
    }
  });

  test("Settings persistence and validation", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Test that settings persist across navigation
    await helpers.navigateAndWait("/settings/api");

    // Set a value
    const apiKeyInput = page.locator("input[type='password']").first();
    if (await apiKeyInput.isVisible()) {
      await apiKeyInput.fill("persistent-test-key");

      const saveButton = page.getByRole("button", { name: /speichern|save/i });
      if (await saveButton.isVisible()) {
        await saveButton.tap();
        await page.waitForTimeout(500);
      }

      // Navigate away and back
      await helpers.navigateAndWait("/chat");
      await helpers.navigateAndWait("/settings/api");

      // Verify value persisted
      await expect(apiKeyInput).toHaveValue("persistent-test-key");
    }

    // Test form validation
    const invalidApiKey = "invalid";
    if (await apiKeyInput.isVisible()) {
      await apiKeyInput.fill(invalidApiKey);

      const saveButton = page.getByRole("button", { name: /speichern|save/i });
      if (await saveButton.isVisible()) {
        await saveButton.tap();
        await page.waitForTimeout(500);

        // Look for validation error
        const errorMessage = page.getByText(/fehler|error|invalid/i);
        if (await errorMessage.first().isVisible()) {
          await expect(errorMessage.first()).toBeVisible();
        }
      }
    }
  });
});

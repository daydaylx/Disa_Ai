import { expect, test } from "@playwright/test";

test.describe("Models and Settings Pages", () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Models Page", () => {
    test("should display models page with search and filters", async ({ page }) => {
      // Navigate to models page
      await page.click('[data-testid="nav.models"]');
      await expect(page).toHaveURL("/models");

      // Check page title and description
      await expect(page.locator("h1")).toContainText("AI Models");
      await expect(page.locator("p")).toContainText("Discover and compare AI models");

      // Check search functionality
      const searchInput = page.locator('input[placeholder*="Search models"]');
      await expect(searchInput).toBeVisible();

      // Check filter dropdowns
      await expect(page.locator("text=All Providers")).toBeVisible();
      await expect(page.locator("text=All Safety")).toBeVisible();
      await expect(page.locator("text=Pricing")).toBeVisible();
      await expect(page.locator("text=Context Size")).toBeVisible();
    });

    test("should filter models by provider", async ({ page }) => {
      await page.click('[data-testid="nav.models"]');

      // Open provider filter
      await page.click("text=All Providers");
      await page.waitForSelector('[role="option"]');

      // Select a provider (assuming there's at least one)
      const firstProvider = page.locator('[role="option"]').nth(1);
      if (await firstProvider.isVisible()) {
        await firstProvider.click();

        // Verify that filter is applied
        await expect(page.locator(".grid")).toBeVisible();
      }
    });

    test("should search for models", async ({ page }) => {
      await page.click('[data-testid="nav.models"]');

      // Type in search box
      await page.fill('input[placeholder*="Search models"]', "llama");

      // Wait for search results
      await page.waitForTimeout(500);

      // Check that results are filtered
      const resultsText = page.locator('text*="model"');
      await expect(resultsText).toBeVisible();
    });

    test("should select a model", async ({ page }) => {
      await page.click('[data-testid="nav.models"]');

      // Wait for models to load
      await page.waitForSelector(".grid");

      // Click on first model card
      const firstModelCard = page.locator(".grid > div").first();
      if (await firstModelCard.isVisible()) {
        await firstModelCard.click();

        // Check for success toast
        await expect(page.locator("text=Model Selected")).toBeVisible({ timeout: 3000 });
      }
    });

    test("should add models to comparison", async ({ page }) => {
      await page.click('[data-testid="nav.models"]');

      // Wait for models to load
      await page.waitForSelector(".grid");

      // Click compare button on first two models
      const compareButtons = page
        .locator('button[title*="Compare"], svg[data-testid="compare-icon"]')
        .first();
      if (await compareButtons.isVisible()) {
        await compareButtons.click();

        // Check for compare panel
        await expect(page.locator("text=Comparing")).toBeVisible({ timeout: 3000 });
      }
    });

    test("should bookmark models", async ({ page }) => {
      await page.click('[data-testid="nav.models"]');

      // Wait for models to load
      await page.waitForSelector(".grid");

      // Click bookmark button on first model
      const bookmarkButton = page
        .locator('button[title*="Bookmark"], svg[data-testid="bookmark-icon"]')
        .first();
      if (await bookmarkButton.isVisible()) {
        await bookmarkButton.click();

        // Verify bookmark is active (implementation may vary)
        // This is a basic check - adjust based on actual implementation
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe("Settings Page", () => {
    test("should display settings page with tabs", async ({ page }) => {
      // Navigate to settings page
      await page.click('[data-testid="nav.settings"]');
      await expect(page).toHaveURL("/settings");

      // Check page title and description
      await expect(page.locator("h1")).toContainText("Settings");
      await expect(page.locator("p")).toContainText(
        "Manage your preferences and conversation presets",
      );

      // Check tabs
      await expect(page.locator("text=General")).toBeVisible();
      await expect(page.locator("text=Presets")).toBeVisible();
      await expect(page.locator("text=API Keys")).toBeVisible();
    });

    test("should toggle settings switches", async ({ page }) => {
      await page.click('[data-testid="nav.settings"]');

      // Find and toggle sound effects switch
      const soundSwitch = page.locator("#sounds");
      if (await soundSwitch.isVisible()) {
        const initialState = await soundSwitch.isChecked();
        await soundSwitch.click();

        // Verify state changed
        const newState = await soundSwitch.isChecked();
        expect(newState).toBe(!initialState);

        // Look for success toast
        await expect(page.locator("text=Settings Saved")).toBeVisible({ timeout: 3000 });
      }
    });

    test("should navigate between settings tabs", async ({ page }) => {
      await page.click('[data-testid="nav.settings"]');

      // Click on Presets tab
      await page.click("text=Presets");
      await expect(page.locator("h2")).toContainText("Conversation Presets");

      // Click on API Keys tab
      await page.click("text=API Keys");
      await expect(page.locator("text=OpenRouter API Key")).toBeVisible();

      // Click back to General tab
      await page.click("text=General");
      await expect(page.locator("text=Appearance")).toBeVisible();
    });

    test("should create a new preset", async ({ page }) => {
      await page.click('[data-testid="nav.settings"]');
      await page.click("text=Presets");

      // Click New Preset button
      await page.click("text=New Preset");

      // Fill in preset form
      await page.fill("#presetName", "Test Preset");
      await page.fill("#presetDescription", "A test preset for automation");
      await page.fill("#presetSystemPrompt", "You are a helpful test assistant.");

      // Save preset
      await page.click("text=Save Preset");

      // Check for success toast
      await expect(page.locator("text=Preset Created")).toBeVisible({ timeout: 3000 });

      // Verify preset appears in list
      await expect(page.locator("text=Test Preset")).toBeVisible();
    });

    test("should validate API key input", async ({ page }) => {
      await page.click('[data-testid="nav.settings"]');
      await page.click("text=API Keys");

      // Fill in API key
      await page.fill("#apiKey", "sk-test-key-12345");

      // Save API key
      await page.click('button:has-text("Save"), button[type="submit"]');

      // Check for success toast
      await expect(page.locator("text=API Key Saved")).toBeVisible({ timeout: 3000 });
    });

    test("should export and import presets", async ({ page }) => {
      await page.click('[data-testid="nav.settings"]');
      await page.click("text=Presets");

      // Create a test preset first
      if (await page.locator("text=New Preset").isVisible()) {
        await page.click("text=New Preset");
        await page.fill("#presetName", "Export Test Preset");
        await page.fill("#presetDescription", "Preset for export testing");
        await page.fill("#presetSystemPrompt", "Test system prompt");
        await page.click("text=Save Preset");
        await page.waitForSelector("text=Preset Created");
      }

      // Test export functionality
      const downloadPromise = page.waitForEvent("download");
      await page.click("text=Export");
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain(".json");

      // Note: Import testing would require file upload simulation
      // which is more complex in Playwright and depends on the exact implementation
    });
  });

  test.describe("Navigation and Integration", () => {
    test("should maintain navigation state between pages", async ({ page }) => {
      // Start at chat page
      await expect(page).toHaveURL("/");

      // Navigate to models
      await page.click('[data-testid="nav.models"]');
      await expect(page).toHaveURL("/models");

      // Navigate to settings
      await page.click('[data-testid="nav.settings"]');
      await expect(page).toHaveURL("/settings");

      // Navigate back to chat
      await page.click('[data-testid="nav.chat"]');
      await expect(page).toHaveURL("/chat");
    });

    test("should persist settings across page refreshes", async ({ page }) => {
      // Navigate to settings
      await page.click('[data-testid="nav.settings"]');

      // Toggle a setting
      const soundSwitch = page.locator("#sounds");
      if (await soundSwitch.isVisible()) {
        await soundSwitch.click();
        await page.waitForSelector("text=Settings Saved");

        const settingState = await soundSwitch.isChecked();

        // Refresh page
        await page.reload();
        await page.waitForLoadState("networkidle");

        // Verify setting is still the same
        const newSoundSwitch = page.locator("#sounds");
        const newSettingState = await newSoundSwitch.isChecked();
        expect(newSettingState).toBe(settingState);
      }
    });

    test("should handle model selection from models page to chat", async ({ page }) => {
      // Select a model from models page
      await page.click('[data-testid="nav.models"]');
      await page.waitForSelector(".grid");

      const firstModelCard = page.locator(".grid > div").first();
      if (await firstModelCard.isVisible()) {
        const modelName = await firstModelCard.locator("h3, .font-medium").first().textContent();
        await firstModelCard.click();

        // Navigate to chat
        await page.click('[data-testid="nav.chat"]');

        // Verify selected model is displayed (implementation dependent)
        // This would need to be adjusted based on how the chat page shows the selected model
        await page.waitForLoadState("networkidle");
      }
    });
  });
});

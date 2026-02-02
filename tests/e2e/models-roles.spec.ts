import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

test.describe("Models & Roles Pages", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test("should display and interact with Models page", async ({ page }) => {
    await page.goto("/models");
    await page.waitForLoadState("networkidle");

    // Check for page header
    await expect(page.getByRole("heading", { level: 1, name: /Modelle/i })).toBeVisible();

    // Check for model cards
    const modelCards = page
      .locator('[data-testid="model-card"]')
      .or(page.locator('[role="button"]').filter({ has: page.locator("text=/Modell|Model/") }));
    await expect(modelCards.first()).toBeVisible();

    // Check for search/filter functionality
    const searchInput = page
      .getByPlaceholder(/Suchen|Search/i)
      .or(page.getByRole("textbox", { name: /Suchen|Filter/i }));
    if (await searchInput.isVisible()) {
      const initialCount = await modelCards.count();
      await searchInput.fill("gpt");
      await page.waitForTimeout(500); // Wait for debounce

      // The query may legitimately yield 0 results (e.g. curated free models contain no "gpt").
      // Ensure the UI reacts without crashing.
      const filteredCount = await modelCards.count();
      if (initialCount > 0) {
        if (filteredCount === 0) {
          await expect(
            page.getByRole("heading", { level: 3, name: /Keine Modelle gefunden/i }),
          ).toBeVisible();
        } else {
          await expect(modelCards.first()).toBeVisible();
        }
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }

      // Reset filter so interaction tests stay stable
      await searchInput.fill("");
      await page.waitForTimeout(250);
    }

    // Check that clicking a model shows details or selects it
    const firstModel = modelCards.first();
    await firstModel.click();
    // After clicking, it might navigate or show details - we'll just check it doesn't error
    await page.waitForTimeout(1000);
  });

  test("should display and interact with Roles page", async ({ page }) => {
    await page.goto("/roles");
    await page.waitForLoadState("networkidle");

    // Check for page header
    await expect(page.getByRole("heading", { level: 1, name: /Rollen/i })).toBeVisible();

    // Check for role cards
    const roleCards = page
      .locator('[data-testid="role-card"]')
      .or(page.locator('[role="button"]').filter({ has: page.locator("text=/Rolle|Persona/") }));
    await expect(roleCards.first()).toBeVisible();

    // Check for category filters if they exist
    const categoryButtons = page
      .getByRole("button")
      .filter({ hasText: /Alle|Kategorie|Category/i });
    if (await categoryButtons.first().isVisible()) {
      await categoryButtons.first().click();
      await page.waitForTimeout(500);
    }

    // Check that clicking a role selects it or navigates to details
    const firstRole = roleCards.first();
    await firstRole.click();

    // Should either navigate back to chat or show selection state
    await page.waitForTimeout(1000);
  });

  test("should navigate between main pages using navigation", async ({ page }) => {
    // Start at chat
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    // Open main menu
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.click();
    const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(menuDrawer).toBeVisible();

    // Navigate to settings
    const settingsLink = menuDrawer.getByRole("link", { name: /^Einstellungen\b/i });
    await expect(settingsLink).toBeVisible();
    await settingsLink.click();
    await expect(page).toHaveURL(/\/settings/);

    // Navigate back to chat
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    // Navigate to models using menu
    await menuButton.click();
    await expect(menuDrawer).toBeVisible();
    const modelsLink = menuDrawer.getByRole("link", { name: /^Modelle\b/i });
    await expect(modelsLink).toBeVisible();
    await modelsLink.click();
    await expect(page).toHaveURL(/\/models/);
  });

  test("should maintain selected role and model state", async ({ page }) => {
    // Set up a role selection
    await page.goto("/roles");
    await page.waitForLoadState("networkidle");

    const roleCards = page
      .locator('[data-testid="role-card"]')
      .or(page.locator('[role="button"]').filter({ has: page.locator("text=/Rolle|Persona/") }));

    const firstRole = roleCards.first();
    await expect(firstRole).toBeVisible();
    await firstRole.click();

    // Navigate to settings and back to chat
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    // Composer should still be available
    await expect(page.getByTestId("composer-input")).toBeVisible();
  });
});

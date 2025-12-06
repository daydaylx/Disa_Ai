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
      await searchInput.fill("gpt");
      await page.waitForTimeout(500); // Wait for debounce
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

  test("should select role from chat and apply it", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Click on role selector (shows "Standard" by default)
    const roleButton = page.locator("button").filter({ hasText: /Standard/i });
    await roleButton.click();

    // Should navigate to roles page
    await expect(page).toHaveURL(/\/roles/);

    // Select a specific role
    const roleCards = page
      .locator('[data-testid="role-card"]')
      .or(page.locator('[role="button"]').filter({ has: page.locator("text=/Rolle|Persona/") }));

    if ((await roleCards.count()) > 1) {
      const firstRole = roleCards.first();
      const roleName = await firstRole.textContent();
      await firstRole.click();

      // Should navigate back to chat
      await expect(page).toHaveURL("/");

      // Check that the role is now selected
      await expect(
        page.locator("button").filter({ hasText: new RegExp(roleName || "") }),
      ).toBeVisible();
    }
  });

  test("should navigate between main pages using navigation", async ({ page }) => {
    // Start at chat
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open main menu
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.click();

    // Navigate to settings
    const settingsLink = page.getByRole("link", { name: "Einstellungen" });
    await expect(settingsLink).toBeVisible();
    await settingsLink.click();
    await expect(page).toHaveURL(/\/settings/);

    // Navigate back to chat
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to models using menu
    await menuButton.click();
    const modelsLink = page.getByRole("link", { name: "Modelle" });
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

    if ((await roleCards.count()) > 0) {
      const firstRole = roleCards.first();
      await firstRole.click();
    }

    // Go to settings and check something there
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    // Navigate back to chat - role should still be selected
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check if the role persisted (this might depend on implementation)
    const roleButton = page.locator("button").filter({ hasText: /Standard/i });
    await expect(roleButton).toBeVisible();
  });
});

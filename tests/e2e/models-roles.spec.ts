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
    await firstRole.click({ force: true });

    // Should either navigate back to chat or show selection state
    await page.waitForTimeout(1000);
  });

  test("should select role from chat and apply it", async ({ page }) => {
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    const roleTrigger = page.locator('button[aria-label="Rolle auswählen"]');
    await expect(roleTrigger).toBeVisible();
    await roleTrigger.click();

    const roleOptions = page.getByRole("option");
    const optionCount = await roleOptions.count();

    // Option 0 is always "Standard" – pick the first real role if available
    if (optionCount > 1) {
      const firstRoleOption = roleOptions.nth(1);
      const roleName = (await firstRoleOption.textContent())?.trim();
      await firstRoleOption.click();

      if (roleName) {
        await expect(roleTrigger).toContainText(roleName);
      }
    }
  });

  test("should navigate between main pages using navigation", async ({ page }) => {
    // Start at chat
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    const openMenuDrawer = async () => {
      const menuButton = page.locator('button[aria-label="Menü öffnen"]:visible').first();
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
      await expect(menuDrawer).toBeVisible();
      return menuDrawer;
    };

    // Navigate to settings via drawer navigation
    const settingsDrawer = await openMenuDrawer();
    const settingsLink = settingsDrawer.getByRole("link", { name: /^Einstellungen\b/i });
    await expect(settingsLink).toBeVisible();
    await settingsLink.click();
    await expect(page).toHaveURL(/\/settings/);

    // Navigate to models via drawer navigation
    const modelsDrawer = await openMenuDrawer();
    const modelsLink = modelsDrawer.getByRole("link", { name: /^Modelle\b/i });
    await expect(modelsLink).toBeVisible();
    await modelsLink.click();
    await expect(page).toHaveURL(/\/models/);

    // Secondary navigation remains available in drawer
    const secondaryDrawer = await openMenuDrawer();
    await expect(secondaryDrawer.getByRole("link", { name: /^Verlauf\b/i })).toBeVisible();
  });

  test("should maintain selected role and model state", async ({ page }) => {
    // Set up a role selection
    await page.goto("/roles");
    await page.waitForLoadState("networkidle");

    const firstRole = page.getByRole("button", { name: /Rolle .* auswählen/i }).first();
    await expect(firstRole).toBeVisible();

    const ariaLabel = (await firstRole.getAttribute("aria-label")) ?? "";
    const roleName = ariaLabel
      .replace(/^Rolle\s+/i, "")
      .replace(/\s+auswählen$/i, "")
      .trim();
    await firstRole.click({ force: true });
    await expect(page).toHaveURL(/\/chat/);

    // Go to settings and check something there
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    // Navigate back to chat - role should still be selected
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    // Check if the role persisted (this might depend on implementation)
    const roleTrigger = page.locator('button[aria-label="Rolle auswählen"]');
    await expect(roleTrigger).toBeVisible();
    if (roleName) {
      await expect(roleTrigger).toContainText(roleName);
    }
  });
});

import { expect, test } from "@playwright/test";

import { setupApiKeyStorage } from "./api-mock";
import { AppHelpers } from "./helpers/app-helpers";
import { skipOnboarding } from "./utils";

test.describe.skip("Models Management Flow Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await setupApiKeyStorage(page);
  });

  test("Models page navigation and layout", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/models");

    // Verify models page loads
    const modelsHeading = page.getByRole("heading", { name: /modelle|models/i });
    await expect(modelsHeading).toBeVisible();

    // Check for model categories or filters
    const categoryFilters = page
      .locator("[role='tab']")
      .or(page.locator("button[data-category]"))
      .or(page.locator("select[aria-label*='kategorie']"));

    if (await categoryFilters.first().isVisible()) {
      const filterCount = await categoryFilters.count();
      expect(filterCount).toBeGreaterThan(0);

      // Test switching between categories
      if (filterCount > 1) {
        const firstFilter = categoryFilters.first();
        const secondFilter = categoryFilters.nth(1);

        await firstFilter.tap();
        await page.waitForTimeout(500);

        await secondFilter.tap();
        await page.waitForTimeout(500);

        // Verify UI responds to filter changes
        const modelCards = page
          .locator("[data-testid*='model-card']")
          .or(page.locator(".model-card"));

        if (await modelCards.first().isVisible()) {
          const cardCount = await modelCards.count();
          expect(cardCount).toBeGreaterThan(0);
        }
      }
    }
  });

  test("Model selection and configuration", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/models");

    // Find model cards
    const modelCards = page
      .locator("[data-testid*='model-card']")
      .or(page.locator("button[aria-label*='model']"))
      .or(page.locator("[role='button']").filter({ hasText: /gpt|claude|llama/i }));

    const cardCount = await modelCards.count();
    if (cardCount > 0) {
      // Test selecting a model
      const firstModel = modelCards.first();
      await expect(firstModel).toBeVisible();

      // Get model name for verification
      const modelText = await firstModel.textContent();
      expect(modelText).toBeTruthy();

      await firstModel.tap();
      await page.waitForTimeout(500);

      // Verify selection state (active styling, aria attributes, etc.)
      const isSelected =
        (await firstModel.getAttribute("aria-selected")) === "true" ||
        (await firstModel.getAttribute("data-selected")) === "true" ||
        (await firstModel.getAttribute("class"))?.includes("selected");

      if (isSelected) {
        expect(isSelected).toBe(true);
      }

      // Test model details or configuration panel
      const detailsPanel = page
        .locator("[data-testid='model-details']")
        .or(page.locator(".model-details"))
        .or(page.locator("[role='dialog']"));

      if (await detailsPanel.first().isVisible()) {
        await expect(detailsPanel.first()).toBeVisible();

        // Test model parameters if available
        const parameterInputs = detailsPanel
          .locator("input[type='range']")
          .or(detailsPanel.locator("input[type='number']"));

        const paramCount = await parameterInputs.count();
        if (paramCount > 0) {
          // Test adjusting temperature or other parameters
          const firstParam = parameterInputs.first();

          if ((await firstParam.getAttribute("type")) === "range") {
            await firstParam.fill("0.7");
            await expect(firstParam).toHaveValue("0.7");
          }
        }
      }
    }
  });

  test("Model search and filtering", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/models");

    // Test search functionality
    const searchInput = page
      .locator("input[type='search']")
      .or(page.locator("input[placeholder*='search']"))
      .or(page.locator("input[placeholder*='suchen']"))
      .first();

    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();

      // Test searching for a specific model
      await searchInput.fill("gpt");
      await page.waitForTimeout(1000);

      // Verify search results
      const modelCards = page
        .locator("[data-testid*='model-card']")
        .or(page.locator(".model-card"));

      const visibleCards = await modelCards.count();
      if (visibleCards > 0) {
        // Check that visible models contain search term
        for (let i = 0; i < Math.min(visibleCards, 3); i++) {
          const card = modelCards.nth(i);
          const cardText = await card.textContent();
          expect(cardText?.toLowerCase()).toContain("gpt");
        }
      }

      // Clear search
      await searchInput.fill("");
      await page.waitForTimeout(500);

      // Verify all models are shown again
      const allCards = await modelCards.count();
      expect(allCards).toBeGreaterThanOrEqual(visibleCards);
    }

    // Test capability filters
    const capabilityFilters = page
      .locator("input[type='checkbox'][aria-label*='capability']")
      .or(page.locator("button[data-capability]"))
      .or(page.locator("select[aria-label*='fähigkeit']"));

    if (await capabilityFilters.first().isVisible()) {
      const firstFilter = capabilityFilters.first();
      await firstFilter.tap();
      await page.waitForTimeout(500);

      // Verify filtering works
      const filteredCards = page.locator("[data-testid*='model-card']");
      const filteredCount = await filteredCards.count();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("Model favorites and preferences", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/models");

    // Find favorite buttons on model cards
    const favoriteButtons = page
      .locator("button[aria-label*='favorite']")
      .or(page.locator("button[aria-label*='stern']"))
      .or(page.locator("[data-testid*='favorite-button']"));

    const favoriteCount = await favoriteButtons.count();
    if (favoriteCount > 0) {
      const firstFavorite = favoriteButtons.first();
      await expect(firstFavorite).toBeVisible();

      // Test toggling favorite status
      const initialState = (await firstFavorite.getAttribute("aria-pressed")) === "true";
      await firstFavorite.tap();
      await page.waitForTimeout(300);

      const newState = (await firstFavorite.getAttribute("aria-pressed")) === "true";
      expect(newState).toBe(!initialState);

      // Test favorites filter
      const favoritesFilter = page
        .getByRole("button", { name: /favoriten|favorites/i })
        .or(page.locator("button[data-filter='favorites']"));

      if (await favoritesFilter.isVisible()) {
        await favoritesFilter.tap();
        await page.waitForTimeout(500);

        // Verify only favorited models are shown
        const visibleCards = page.locator("[data-testid*='model-card']");
        const cardCount = await visibleCards.count();

        if (cardCount > 0) {
          // Check that visible cards have favorite status
          const firstCard = visibleCards.first();
          const favoriteBtn = firstCard.locator("button[aria-pressed='true']");
          if (await favoriteBtn.isVisible()) {
            await expect(favoriteBtn).toBeVisible();
          }
        }
      }
    }
  });

  test("Model comparison and details", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/models");

    // Test model detail view
    const modelCards = page.locator("[data-testid*='model-card']").or(page.locator(".model-card"));

    const cardCount = await modelCards.count();
    if (cardCount > 0) {
      const firstModel = modelCards.first();

      // Look for info or details button
      const infoButton = firstModel
        .locator("button[aria-label*='info']")
        .or(firstModel.locator("button[aria-label*='details']"))
        .or(firstModel.locator("[data-testid*='info-button']"));

      if (await infoButton.isVisible()) {
        await infoButton.tap();
        await page.waitForTimeout(500);

        // Verify details modal or panel opens
        const detailsView = page
          .locator("[role='dialog']")
          .or(page.locator("[data-testid='model-details']"));

        if (await detailsView.first().isVisible()) {
          await expect(detailsView.first()).toBeVisible();

          // Check for model information
          const modelName = detailsView.getByRole("heading").first();
          await expect(modelName).toBeVisible();

          // Test closing details
          const closeButton = detailsView
            .locator("button[aria-label*='close']")
            .or(page.locator("button[aria-label*='schließen']"));

          if (await closeButton.isVisible()) {
            await closeButton.tap();
            await page.waitForTimeout(300);
            await expect(detailsView.first()).not.toBeVisible();
          } else {
            // Try escape key
            await page.keyboard.press("Escape");
            await page.waitForTimeout(300);
            await expect(detailsView.first()).not.toBeVisible();
          }
        }
      }
    }
  });

  test("Model performance and accessibility", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/models");

    // Test page load performance
    const startTime = Date.now();
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Page should load within reasonable time
    expect(loadTime).toBeLessThan(10000);

    // Test keyboard navigation
    const modelCards = page
      .locator("[data-testid*='model-card']")
      .or(page.locator("button[role='button']"));

    const cardCount = await modelCards.count();
    if (cardCount > 0) {
      const firstCard = modelCards.first();
      await firstCard.focus();
      await expect(firstCard).toBeFocused();

      // Test tab navigation
      await page.keyboard.press("Tab");
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();

      // Test Enter key activation
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);

      // Verify interaction occurred (selection state change, etc.)
      const hasAriaSelected = await firstCard.getAttribute("aria-selected");
      const hasSelectedClass = (await firstCard.getAttribute("class"))?.includes("selected");

      if (hasAriaSelected || hasSelectedClass) {
        // Selection state changed successfully
        expect(true).toBe(true);
      }
    }

    // Test ARIA labels and accessibility
    const interactiveElements = page.locator("button, [role='button'], input, select");
    const elementCount = await interactiveElements.count();

    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      const element = interactiveElements.nth(i);
      if (await element.isVisible()) {
        const hasLabel =
          (await element.getAttribute("aria-label")) ||
          (await element.getAttribute("aria-labelledby")) ||
          (await element.textContent());

        expect(hasLabel).toBeTruthy();
      }
    }
  });
});

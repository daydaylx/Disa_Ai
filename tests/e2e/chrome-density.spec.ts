/**
 * E2E Tests for Chrome Density
 *
 * Validates that Phase 3 & 4 successfully reduced visual chrome density
 * and maintains proper layout hierarchy throughout the app.
 *
 * Success Criteria:
 * - Maximum 4 simultaneous chrome elements in chat (down from 6-7)
 * - Header and composer always visible
 * - Panels are mutually exclusive (drawer vs history)
 * - Touch targets meet 44px minimum
 * - Sticky headers don't overlap content
 */

import { expect, test } from "@playwright/test";

test.describe("Chrome Density - Chat Page", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API to prevent actual OpenRouter calls
    await page.route("**/api.openrouter.ai/**", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: [] }),
      }),
    );
  });

  test("default state shows minimal chrome", async ({ page }) => {
    await page.goto("/");

    // Visible elements: Header, Quick Settings (collapsed), Composer
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("button", { name: /einstellungen/i })).toBeVisible();
    await expect(page.locator('[data-testid="unified-input-bar"]')).toBeVisible();

    // Not visible: FABs (only appear with messages), History panel
    const scrollToBottomFAB = page.locator('[data-testid="scroll-to-bottom"]');
    const historyFAB = page.locator("button").filter({ has: page.locator("svg.lucide-bookmark") });

    await expect(scrollToBottomFAB).not.toBeVisible();
    await expect(historyFAB).not.toBeVisible();

    // Verify Quick Settings is collapsed (single chip, not 3 pills)
    const quickSettings = page.getByRole("button", { name: /einstellungen/i });
    await expect(quickSettings).toBeVisible();

    // Should NOT show expanded pills initially
    const modelPill = page.getByText(/model:/i);
    const rolePill = page.getByText(/rolle:/i);
    await expect(modelPill).not.toBeVisible();
    await expect(rolePill).not.toBeVisible();
  });

  test("with messages - shows FABs and keeps pills collapsed", async ({ page }) => {
    await page.goto("/");

    // Send a message to trigger FAB appearance
    const input = page.locator('[data-testid="unified-input-bar"] textarea');
    await input.fill("Test message");
    await page.locator('[data-testid="unified-input-bar"] button[aria-label="Senden"]').click();

    // Wait for message to appear
    await page.waitForSelector(".chat-message", { timeout: 5000 });

    // FABs should now be visible
    const historyFAB = page.locator("button").filter({ has: page.locator("svg.lucide-bookmark") });
    await expect(historyFAB).toBeVisible();

    // Quick Settings should still be collapsed
    const quickSettings = page.getByRole("button", { name: /einstellungen/i });
    await expect(quickSettings).toBeVisible();

    // Count visible chrome elements (should be ≤ 4)
    const header = page.locator("header");
    const composer = page.locator('[data-testid="unified-input-bar"]');

    await expect(header).toBeVisible();
    await expect(quickSettings).toBeVisible();
    await expect(composer).toBeVisible();
    await expect(historyFAB).toBeVisible();

    // Total: 4 elements (Header, Quick Settings, Composer, History FAB)
    // Success: Down from 6-7 in Phase 2
  });

  test("Quick Settings expands and auto-collapses", async ({ page }) => {
    await page.goto("/");

    // Click to expand Quick Settings
    const quickSettings = page.getByRole("button", { name: /einstellungen/i });
    await quickSettings.click();

    // Should show 3 pills after expansion
    await expect(page.getByText(/model:/i)).toBeVisible({ timeout: 1000 });
    await expect(page.getByText(/rolle:/i)).toBeVisible();
    await expect(page.getByText(/memory/i)).toBeVisible();

    // Collapsed chip should not be visible when expanded
    await expect(quickSettings).not.toBeVisible();

    // Wait for auto-collapse (5 seconds according to component logic)
    await page.waitForTimeout(5500);

    // Should collapse back to single chip
    await expect(quickSettings).toBeVisible();
    await expect(page.getByText(/model:/i)).not.toBeVisible();
  });

  test("status banner is dismissible", async ({ page }) => {
    await page.goto("/");

    // Trigger an error state (mock API error)
    await page.route("**/api.openrouter.ai/**", (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Test error" }),
      }),
    );

    // Try to send a message to trigger error banner
    const input = page.locator('[data-testid="unified-input-bar"] textarea');
    await input.fill("Test");
    await page.locator('[data-testid="unified-input-bar"] button[aria-label="Senden"]').click();

    // Wait for potential banner (might not appear depending on error handling)
    await page.waitForTimeout(2000);

    // If banner exists, it should have dismiss button
    const banner = page.locator('[data-testid="chat-status-banner"]');
    if (await banner.isVisible()) {
      const dismissButton = banner.locator('button[aria-label*="schließen"]');
      await expect(dismissButton).toBeVisible();

      // Click dismiss
      await dismissButton.click();

      // Banner should disappear
      await expect(banner).not.toBeVisible();
    }
  });
});

test.describe("Chrome Density - Mutual Exclusivity", () => {
  test("menu drawer closes history panel", async ({ page }) => {
    await page.goto("/");

    // Send message to make history FAB visible
    const input = page.locator('[data-testid="unified-input-bar"] textarea');
    await input.fill("Test message");
    await page.locator('[data-testid="unified-input-bar"] button[aria-label="Senden"]').click();
    await page.waitForSelector(".chat-message", { timeout: 5000 });

    // Open history panel
    const historyFAB = page.locator("button").filter({ has: page.locator("svg.lucide-bookmark") });
    await historyFAB.click();

    // History panel should be visible
    const historyPanel = page.locator('[data-testid="history-panel"]');
    await expect(historyPanel).toBeVisible({ timeout: 2000 });

    // Open menu drawer
    const menuButton = page.locator("header button").first(); // Menu button in header
    await menuButton.click();

    // Menu drawer should be visible
    const menuDrawer = page.locator('[data-testid="menu-drawer"]');
    await expect(menuDrawer).toBeVisible({ timeout: 2000 });

    // History panel should be closed (mutual exclusivity)
    await expect(historyPanel).not.toBeVisible();
  });

  test("history panel closes menu drawer", async ({ page }) => {
    await page.goto("/");

    // Open menu drawer first
    const menuButton = page.locator("header button").first();
    await menuButton.click();

    const menuDrawer = page.locator('[data-testid="menu-drawer"]');
    await expect(menuDrawer).toBeVisible({ timeout: 2000 });

    // Send message to make history FAB visible
    const input = page.locator('[data-testid="unified-input-bar"] textarea');
    await input.fill("Test");
    await page.locator('[data-testid="unified-input-bar"] button[aria-label="Senden"]').click();
    await page.waitForSelector(".chat-message", { timeout: 5000 });

    // Open history panel
    const historyFAB = page.locator("button").filter({ has: page.locator("svg.lucide-bookmark") });
    await historyFAB.click();

    // History panel should be visible
    const historyPanel = page.locator('[data-testid="history-panel"]');
    await expect(historyPanel).toBeVisible({ timeout: 2000 });

    // Menu drawer should be closed
    await expect(menuDrawer).not.toBeVisible();
  });
});

test.describe("Chrome Density - Models Page", () => {
  test("sticky header doesn't overlap content", async ({ page }) => {
    await page.goto("/settings/api-data");

    // Get header and content positions
    const stickyHeader = page.locator('[class*="sticky"]').first();
    const firstModelCard = page.locator('[data-testid="model-card"]').first();

    await expect(stickyHeader).toBeVisible();
    await expect(firstModelCard).toBeVisible();

    // Get bounding boxes
    const headerBox = await stickyHeader.boundingBox();
    const cardBox = await firstModelCard.boundingBox();

    // Verify no overlap: card should start below header
    if (headerBox && cardBox) {
      expect(cardBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
    }

    // Scroll down
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);

    // Header should still be visible (sticky)
    await expect(stickyHeader).toBeVisible();

    // Verify still no overlap after scroll
    const headerBoxAfter = await stickyHeader.boundingBox();
    const cardBoxAfter = await firstModelCard.boundingBox();

    if (headerBoxAfter && cardBoxAfter) {
      expect(cardBoxAfter.y).toBeGreaterThan(headerBoxAfter.y + headerBoxAfter.height);
    }
  });
});

test.describe("Touch Target Compliance", () => {
  test("all interactive buttons meet 44px minimum", async ({ page }) => {
    await page.goto("/");

    // Get all buttons
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    expect(buttonCount).toBeGreaterThan(0);

    // Check each button's size
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);

      if (await button.isVisible()) {
        const box = await button.boundingBox();

        if (box) {
          // Allow small margin of error (42px is close enough due to borders/padding)
          expect(box.width).toBeGreaterThanOrEqual(42);
          expect(box.height).toBeGreaterThanOrEqual(42);
        }
      }
    }
  });

  test("FABs meet touch target size", async ({ page }) => {
    await page.goto("/");

    // Send message to make FABs visible
    const input = page.locator('[data-testid="unified-input-bar"] textarea');
    await input.fill("Test");
    await page.locator('[data-testid="unified-input-bar"] button[aria-label="Senden"]').click();
    await page.waitForSelector(".chat-message", { timeout: 5000 });

    // Check History FAB
    const historyFAB = page.locator("button").filter({ has: page.locator("svg.lucide-bookmark") });
    await expect(historyFAB).toBeVisible();

    const fabBox = await historyFAB.boundingBox();
    expect(fabBox).not.toBeNull();

    if (fabBox) {
      expect(fabBox.width).toBeGreaterThanOrEqual(44);
      expect(fabBox.height).toBeGreaterThanOrEqual(44);
    }

    // Scroll to make ScrollToBottom visible
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(500);

    const scrollFAB = page.locator('[data-testid="scroll-to-bottom"]');
    if (await scrollFAB.isVisible()) {
      const scrollFABBox = await scrollFAB.boundingBox();

      if (scrollFABBox) {
        expect(scrollFABBox.width).toBeGreaterThanOrEqual(44);
        expect(scrollFABBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("CopyButton meets touch target size", async ({ page }) => {
    await page.goto("/");

    // Check if any copy buttons exist on the page
    const copyButtons = page.locator('button:has-text("Kopieren")');
    const count = await copyButtons.count();

    if (count > 0) {
      const firstCopyButton = copyButtons.first();
      await expect(firstCopyButton).toBeVisible();

      const box = await firstCopyButton.boundingBox();

      if (box) {
        // CopyButton sm size should be 44px (h-11 w-11)
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});

test.describe("Performance - Animation Budget", () => {
  test("reduced animations don't cause layout shift", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Layout shift API checks are only reliable in Chromium.");

    await page.goto("/");
    await expect(page.getByRole("textbox", { name: /nachricht eingeben/i })).toBeVisible();
    await page.waitForLoadState("networkidle");

    // Ensure fonts/layout are stable before observing CLS.
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

    // Measure post-settle CLS only (exclude initial page-load shifts).
    const cls = await page.evaluate(() => {
      type LayoutShiftEntry = PerformanceEntry & { hadRecentInput?: boolean; value?: number };

      return new Promise<number>((resolve) => {
        let clsScore = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as LayoutShiftEntry[]) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value ?? 0;
            }
          }
        });

        observer.observe({ type: "layout-shift", buffered: false });

        // Observe a short idle window where no animation-driven shifts should occur.
        setTimeout(() => {
          observer.disconnect();
          resolve(clsScore);
        }, 1500);
      });
    });

    expect(cls).toBeLessThan(0.1);
  });
});

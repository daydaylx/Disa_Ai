import AxeBuilder from '@axe-core/playwright';
import { expect,test } from '@playwright/test';

test.describe('AppShell Layout & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="app-main"]')).toBeVisible({ timeout: 10000 });
  });

  test('Skip-Link & AppShell structure exists', async ({ page }) => {
    // Skip-Link (A11y touch-target added)
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveClass(/tap-target/);

    // AppShell main container
    await expect(page.locator('[data-testid="app-main"]')).toBeVisible();
  });

  test('PRIMARY_NAV_ITEMS rendered correctly (5 items)', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Primäre Navigation"]');
    await expect(nav).toBeVisible();
    const navLinks = nav.locator('a');
    await expect(navLinks).toHaveCount(5);

    const expectedPaths = ['/', '/chat', '/models', '/roles', '/settings'];
    for (let i = 0; i < 5; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', expectedPaths[i]);
    }
  });

  test('Navigation is accessible (Axe)', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Skip-Link focuses main content', async ({ page }) => {
    const skipLink = page.locator('a[href="#main"]');
    await skipLink.focus();
    await expect(page.locator('#main')).toBeFocused();
  });
});

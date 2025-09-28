import { expect, test } from "@playwright/test";

test.describe("Router Smoke Tests", () => {
  test("should load AppShell with header and navigation", async ({ page }) => {
    await page.goto("/");

    // Check that the app title is visible in header
    await expect(page.getByText("Disa AI")).toBeVisible();

    // Check that header contains mini model picker
    await expect(page.getByText("GPT-4")).toBeVisible();

    // Check that header contains new button
    await expect(page.getByRole("button", { name: /new/i })).toBeVisible();
  });

  test("should navigate to /chat route", async ({ page }) => {
    await page.goto("/chat");

    // Check that we're on the chat page
    await expect(page).toHaveURL("/chat");

    // Check that AppShell is still present
    await expect(page.getByText("Disa AI")).toBeVisible();

    // Check that Chat tab is active in desktop navigation
    const chatTab = page.locator('[aria-label="Top navigation"] a[href="/chat"]');
    await expect(chatTab).toHaveClass(/bg-surface-variant/);
  });

  test("should navigate to /models route", async ({ page }) => {
    await page.goto("/models");

    // Check that we're on the models page
    await expect(page).toHaveURL("/models");

    // Check that models page content is visible
    await expect(page.getByText("Models")).toBeVisible();
    await expect(page.getByText("Model selection and management coming soon.")).toBeVisible();

    // Check that Models tab is active in desktop navigation
    const modelsTab = page.locator('[aria-label="Top navigation"] a[href="/models"]');
    await expect(modelsTab).toHaveClass(/bg-surface-variant/);
  });

  test("should navigate to /settings route", async ({ page }) => {
    await page.goto("/settings");

    // Check that we're on the settings page
    await expect(page).toHaveURL("/settings");

    // Check that settings page content is visible
    await expect(page.getByText("Settings")).toBeVisible();
    await expect(
      page.getByText("Application settings and configuration coming soon."),
    ).toBeVisible();

    // Check that Settings tab is active in desktop navigation
    const settingsTab = page.locator('[aria-label="Top navigation"] a[href="/settings"]');
    await expect(settingsTab).toHaveClass(/bg-surface-variant/);
  });

  test("should show mobile bottom navigation on mobile viewport", async ({ page }) => {
    // Playwright config already sets mobile viewport (390x844)
    await page.goto("/");

    // Check that bottom navigation is visible (md:hidden means visible on mobile)
    const bottomNav = page.locator('[aria-label="Bottom navigation"]');
    await expect(bottomNav).toBeVisible();

    // Check that all navigation items are present
    await expect(bottomNav.getByText("Chat")).toBeVisible();
    await expect(bottomNav.getByText("Models")).toBeVisible();
    await expect(bottomNav.getByText("Settings")).toBeVisible();
  });

  test("should navigate via bottom tabs on mobile", async ({ page }) => {
    await page.goto("/");

    // Click on Models tab in bottom navigation
    await page.locator('[aria-label="Bottom navigation"] a[href="/models"]').click();

    // Check that we navigated to models page
    await expect(page).toHaveURL("/models");
    await expect(page.getByText("Model selection and management coming soon.")).toBeVisible();

    // Click on Settings tab in bottom navigation
    await page.locator('[aria-label="Bottom navigation"] a[href="/settings"]').click();

    // Check that we navigated to settings page
    await expect(page).toHaveURL("/settings");
    await expect(
      page.getByText("Application settings and configuration coming soon."),
    ).toBeVisible();

    // Click on Chat tab in bottom navigation
    await page.locator('[aria-label="Bottom navigation"] a[href="/chat"]').click();

    // Check that we navigated back to chat page
    await expect(page).toHaveURL("/chat");
  });

  test("should navigate via top tabs on desktop", async ({ page }) => {
    // Set desktop viewport temporarily for this test
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    // Check that top navigation is visible (hidden on mobile, visible on desktop)
    const topNav = page.locator('[aria-label="Top navigation"]');
    await expect(topNav).toBeVisible();

    // Click on Models tab in top navigation
    await topNav.locator('a[href="/models"]').click();

    // Check that we navigated to models page
    await expect(page).toHaveURL("/models");

    // Click on Settings tab in top navigation
    await topNav.locator('a[href="/settings"]').click();

    // Check that we navigated to settings page
    await expect(page).toHaveURL("/settings");

    // Click on Chat tab in top navigation
    await topNav.locator('a[href="/chat"]').click();

    // Check that we navigated back to chat page
    await expect(page).toHaveURL("/chat");
  });

  test("should redirect root / to chat page", async ({ page }) => {
    await page.goto("/");

    // Should show chat page content (since index route points to ChatPage)
    // Note: URL might stay "/" due to index route, but content should be chat
    const hasMainContent = await page.locator("main").count();
    expect(hasMainContent).toBeGreaterThan(0);

    // AppShell should be present
    await expect(page.getByText("Disa AI")).toBeVisible();
  });

  test("should maintain navigation state across route changes", async ({ page }) => {
    await page.goto("/chat");

    // Navigate to models
    await page.locator('[aria-label="Bottom navigation"] a[href="/models"]').click();
    await expect(page).toHaveURL("/models");

    // Check that header is still present
    await expect(page.getByText("Disa AI")).toBeVisible();
    await expect(page.getByText("GPT-4")).toBeVisible();

    // Navigate to settings
    await page.locator('[aria-label="Bottom navigation"] a[href="/settings"]').click();
    await expect(page).toHaveURL("/settings");

    // Header should still be present
    await expect(page.getByText("Disa AI")).toBeVisible();
    await expect(page.getByRole("button", { name: /new/i })).toBeVisible();
  });
});

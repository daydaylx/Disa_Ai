import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Design System Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page);
  });

  test("Chat interface - Desktop Light Theme", async ({ page }) => {
    await page.goto("/");

    // Wait for models to load
    await page.waitForTimeout(3000);

    // Add some test content to showcase the interface
    await page.getByTestId("composer-input").fill("Test message to showcase chat interface");
    await page.getByTestId("composer-send").click();

    // Wait for message to appear
    await page.waitForTimeout(2000);

    // Take screenshot of main chat interface
    await expect(page).toHaveScreenshot("chat-desktop-light.png", {
      fullPage: true,
      threshold: 0.3, // Allow 30% difference for minor rendering variations
    });
  });

  test("Chat interface - Desktop Dark Theme", async ({ page }) => {
    // Set dark theme
    await page.addInitScript(() => {
      document.documentElement.classList.add("dark");
    });

    await page.goto("/");

    // Wait for models to load
    await page.waitForTimeout(3000);

    // Add test content
    await page.getByTestId("composer-input").fill("Test message in dark theme");
    await page.getByTestId("composer-send").click();

    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot("chat-desktop-dark.png", {
      fullPage: true,
      threshold: 0.3,
    });
  });

  test("Chat interface - Mobile Viewport", async ({ page }) => {
    // Set mobile viewport (390x844 as per professional standards)
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/");

    await page.waitForTimeout(3000);

    // Test mobile-specific glass components
    await page.getByTestId("composer-input").fill("Mobile test message");
    await page.getByTestId("composer-send").click();

    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot("chat-mobile.png", {
      fullPage: true,
      threshold: 0.3,
    });
  });

  test("Glass Components Showcase", async ({ page }) => {
    await page.goto("/");

    // Wait for components to load
    await page.waitForTimeout(2000);

    // Focus on main chat area to show glass effects
    const chatArea = page.locator('[data-testid="composer-input"]');
    await chatArea.focus();

    // Screenshot focused state to capture glass effects
    await expect(page.locator("main")).toHaveScreenshot("glass-components-showcase.png", {
      threshold: 0.3,
    });
  });

  test("Button States Regression", async ({ page }) => {
    await page.goto("/");

    await page.waitForTimeout(2000);

    // Test button in different states
    const sendButton = page.getByTestId("composer-send");

    // Default state
    await expect(sendButton).toHaveScreenshot("button-default.png");

    // Enable button by adding text
    await page.getByTestId("composer-input").fill("Test");

    // Enabled state
    await expect(sendButton).toHaveScreenshot("button-enabled.png");

    // Hover state
    await sendButton.hover();
    await expect(sendButton).toHaveScreenshot("button-hover.png");
  });

  test("Settings View - Glass System", async ({ page }) => {
    await page.goto("/settings");

    await page.waitForTimeout(1000);

    // Test settings interface with glass components
    await expect(page).toHaveScreenshot("settings-glass-system.png", {
      fullPage: true,
      threshold: 0.3,
    });
  });

  test("Professional Color Palette", async ({ page }) => {
    await page.goto("/");

    await page.waitForTimeout(2000);

    // Check PersonaQuickBar professional colors
    const personaBar = page.locator('.persona-quick-bar, [data-testid*="persona"]').first();
    if ((await personaBar.count()) > 0) {
      await expect(personaBar).toHaveScreenshot("professional-colors.png", {
        threshold: 0.2,
      });
    }
  });
});

test.describe("Accessibility Visual Validation", () => {
  test("High Contrast Mode", async ({ page }) => {
    // Force high contrast mode
    await page.addInitScript(() => {
      const style = document.createElement("style");
      style.textContent =
        "@media (prefers-contrast: high) { * { filter: contrast(2) !important; } }";
      document.head.appendChild(style);
    });

    await page.goto("/");
    await setupTestEnvironment(page);

    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot("high-contrast-mode.png", {
      fullPage: true,
      threshold: 0.4, // Higher threshold for contrast changes
    });
  });

  test("Reduced Motion Mode", async ({ page }) => {
    // Force reduced motion
    await page.addInitScript(() => {
      const style = document.createElement("style");
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    });

    await page.goto("/");
    await setupTestEnvironment(page);

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("reduced-motion.png", {
      fullPage: true,
      threshold: 0.3,
    });
  });
});
